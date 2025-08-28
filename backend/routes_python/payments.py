from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import os
from datetime import datetime
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest

router = APIRouter(prefix="/payments", tags=["payments"])

# Subscription packages - NEVER accept amounts from frontend
SUBSCRIPTION_PACKAGES = {
    "pro_monthly": {
        "name": "Pro Monthly",
        "amount": 19.0,
        "currency": "usd",
        "credits": 500,
        "duration": "monthly",
        "description": "Pro plan - 500 credits per month"
    },
    "pro_yearly": {
        "name": "Pro Yearly", 
        "amount": 190.0,
        "currency": "usd",
        "credits": 6000,  # 500 * 12 months
        "duration": "yearly",
        "description": "Pro plan - 6000 credits per year (20% discount)"
    },
    "enterprise_monthly": {
        "name": "Enterprise Monthly",
        "amount": 99.0,
        "currency": "usd", 
        "credits": "unlimited",
        "duration": "monthly",
        "description": "Enterprise plan - Unlimited credits per month"
    },
    "enterprise_yearly": {
        "name": "Enterprise Yearly",
        "amount": 990.0,
        "currency": "usd",
        "credits": "unlimited",
        "duration": "yearly", 
        "description": "Enterprise plan - Unlimited credits per year (20% discount)"
    }
}

# Request Models
class CreateCheckoutRequest(BaseModel):
    package_id: str = Field(..., description="The subscription package ID")
    origin_url: str = Field(..., description="The frontend origin URL for success/cancel redirects")

class PaymentTransactionCreate(BaseModel):
    session_id: str
    package_id: str
    amount: float
    currency: str
    user_id: Optional[str] = None
    user_email: Optional[str] = None
    payment_status: str = "pending"
    metadata: Dict[str, Any]

# Response Models
class CheckoutResponse(BaseModel):
    success: bool
    checkout_url: str
    session_id: str
    package_info: Dict[str, Any]

class PaymentStatusResponse(BaseModel):
    success: bool
    payment_status: str
    status: str
    amount_total: float
    currency: str
    package_info: Dict[str, Any]
    credits_added: Optional[int] = None

@router.post("/checkout", response_model=CheckoutResponse)
async def create_checkout_session(request: CreateCheckoutRequest, http_request: Request):
    """Create Stripe checkout session for subscription"""
    try:
        # Validate package exists
        if request.package_id not in SUBSCRIPTION_PACKAGES:
            raise HTTPException(status_code=400, detail="Invalid subscription package")
        
        package = SUBSCRIPTION_PACKAGES[request.package_id]
        
        # Get Stripe API key from environment
        stripe_api_key = os.getenv('STRIPE_API_KEY')
        if not stripe_api_key:
            raise HTTPException(status_code=500, detail="Payment system not configured")
        
        # Initialize Stripe checkout
        host_url = str(http_request.base_url)
        webhook_url = f"{host_url}api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
        
        # Build success and cancel URLs using frontend origin
        success_url = f"{request.origin_url}?payment_success=true&session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{request.origin_url}?payment_cancelled=true"
        
        # Create checkout session request
        checkout_request = CheckoutSessionRequest(
            amount=package["amount"],
            currency=package["currency"],
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                "package_id": request.package_id,
                "package_name": package["name"],
                "credits": str(package["credits"]),
                "duration": package["duration"]
            }
        )
        
        # Create checkout session with Stripe
        session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)
        
        # Create payment transaction record
        transaction_data = PaymentTransactionCreate(
            session_id=session.session_id,
            package_id=request.package_id,
            amount=package["amount"],
            currency=package["currency"],
            payment_status="pending",
            metadata={
                "package_name": package["name"],
                "credits": package["credits"],
                "duration": package["duration"],
                "checkout_url": session.url
            }
        )
        
        # Save transaction to database
        await http_request.app.state.db.payment_transactions.insert_one({
            **transaction_data.dict(),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        })
        
        return CheckoutResponse(
            success=True,
            checkout_url=session.url,
            session_id=session.session_id,
            package_info=package
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Checkout creation error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create checkout session")

@router.get("/status/{session_id}", response_model=PaymentStatusResponse)
async def get_payment_status(session_id: str, http_request: Request):
    """Get payment status and update credits if successful"""
    try:
        # Find transaction record
        transaction = await http_request.app.state.db.payment_transactions.find_one({
            "session_id": session_id
        })
        
        if not transaction:
            raise HTTPException(status_code=404, detail="Payment session not found")
        
        # Get Stripe API key
        stripe_api_key = os.getenv('STRIPE_API_KEY')
        if not stripe_api_key:
            raise HTTPException(status_code=500, detail="Payment system not configured")
        
        # Initialize Stripe checkout
        host_url = str(http_request.base_url)
        webhook_url = f"{host_url}api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
        
        # Check payment status with Stripe
        checkout_status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
        
        # Update transaction status if changed
        if checkout_status.payment_status != transaction["payment_status"]:
            await http_request.app.state.db.payment_transactions.update_one(
                {"session_id": session_id},
                {
                    "$set": {
                        "payment_status": checkout_status.payment_status,
                        "status": checkout_status.status,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            # If payment successful and not already processed, add credits
            if (checkout_status.payment_status == "paid" and 
                transaction["payment_status"] != "paid"):
                
                package_id = transaction["package_id"]
                if package_id in SUBSCRIPTION_PACKAGES:
                    package = SUBSCRIPTION_PACKAGES[package_id]
                    credits = package["credits"]
                    
                    # Add credits to user account (if they have an account)
                    # For demo purposes, we'll just log this
                    print(f"Payment successful for session {session_id}")
                    print(f"Would add {credits} credits to user account")
                    
                    # In real implementation:
                    # if transaction.get("user_id"):
                    #     await add_credits_to_user(transaction["user_id"], credits)
        
        # Get updated package info
        package = SUBSCRIPTION_PACKAGES.get(transaction["package_id"], {})
        
        return PaymentStatusResponse(
            success=True,
            payment_status=checkout_status.payment_status,
            status=checkout_status.status,
            amount_total=checkout_status.amount_total / 100,  # Convert from cents
            currency=checkout_status.currency,
            package_info=package,
            credits_added=package.get("credits") if checkout_status.payment_status == "paid" else None
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Payment status error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get payment status")

@router.post("/webhook/stripe")
async def stripe_webhook(http_request: Request):
    """Handle Stripe webhooks"""
    try:
        # Get Stripe API key
        stripe_api_key = os.getenv('STRIPE_API_KEY')
        if not stripe_api_key:
            raise HTTPException(status_code=500, detail="Payment system not configured")
        
        # Get webhook body and signature
        webhook_body = await http_request.body()
        stripe_signature = http_request.headers.get("Stripe-Signature")
        
        if not stripe_signature:
            raise HTTPException(status_code=400, detail="Missing Stripe signature")
        
        # Initialize Stripe checkout
        host_url = str(http_request.base_url)
        webhook_url = f"{host_url}api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
        
        # Handle webhook
        webhook_response = await stripe_checkout.handle_webhook(webhook_body, stripe_signature)
        
        # Process the webhook event
        if webhook_response.event_type == "checkout.session.completed":
            session_id = webhook_response.session_id
            
            # Update transaction status
            await http_request.app.state.db.payment_transactions.update_one(
                {"session_id": session_id},
                {
                    "$set": {
                        "payment_status": webhook_response.payment_status,
                        "webhook_processed": True,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            print(f"Webhook processed for session {session_id}")
        
        return {"success": True, "event_processed": True}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=500, detail="Webhook processing failed")

@router.get("/packages")
async def get_subscription_packages():
    """Get available subscription packages"""
    return {
        "success": True,
        "packages": SUBSCRIPTION_PACKAGES
    }