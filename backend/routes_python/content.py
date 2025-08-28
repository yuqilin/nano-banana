from fastapi import APIRouter, HTTPException
from typing import Optional, List
from datetime import datetime

router = APIRouter(prefix="/content", tags=["content"])

# Mock content data
mock_features = [
    {
        "id": 1,
        "title": "Natural Language Editing",
        "description": "Edit images using simple text prompts. Nano-banana AI understands complex instructions like GPT for images",
        "icon": "💬",
        "color": "from-orange-400 to-orange-500",
        "isActive": True
    },
    {
        "id": 2,
        "title": "Character Consistency", 
        "description": "Maintain perfect character details across edits. This model excels at preserving faces and identities",
        "icon": "🎭",
        "color": "from-orange-500 to-red-500",
        "isActive": True
    },
    {
        "id": 3,
        "title": "Scene Preservation",
        "description": "Seamlessly blend edits with original backgrounds. Superior scene fusion compared to Flux Kontext",
        "icon": "🎨",
        "color": "from-red-500 to-pink-500",
        "isActive": True
    },
    {
        "id": 4,
        "title": "One-Shot Editing",
        "description": "Perfect results in a single attempt. Nano-banana solves one-shot image editing challenges effortlessly",
        "icon": "🎯",
        "color": "from-orange-400 to-yellow-500",
        "isActive": True
    },
    {
        "id": 5,
        "title": "Multi-Image Context",
        "description": "Process multiple images simultaneously. Support for advanced multi-image editing workflows", 
        "icon": "📚",
        "color": "from-blue-400 to-blue-500",
        "isActive": True
    },
    {
        "id": 6,
        "title": "AI UGC Creation",
        "description": "Create consistent AI influencers and UGC content. Perfect for social media and marketing campaigns",
        "icon": "⭐", 
        "color": "from-purple-400 to-purple-500",
        "isActive": True
    }
]

mock_reviews = [
    {
        "id": 1,
        "name": "AIArtistPro",
        "role": "Digital Creator",
        "content": "This editor completely changed my workflow. The character consistency is incredible - miles ahead of Flux Kontext!",
        "avatar": "AP",
        "rating": 5,
        "isVerified": True,
        "createdAt": "2024-01-15T00:00:00Z"
    },
    {
        "id": 2,
        "name": "ContentCreator", 
        "role": "UGC Specialist",
        "content": "Creating consistent AI influencers has never been easier. It maintains perfect face details across edits!",
        "avatar": "CC",
        "rating": 5,
        "isVerified": True,
        "createdAt": "2024-01-18T00:00:00Z"
    },
    {
        "id": 3,
        "name": "PhotoEditor",
        "role": "Professional Editor",
        "content": "One-shot editing is basically solved with this tool. The scene blending is so natural and realistic!",
        "avatar": "PE", 
        "rating": 5,
        "isVerified": True,
        "createdAt": "2024-01-20T00:00:00Z"
    }
]

mock_faqs = [
    {
        "id": 1,
        "question": "What is Nano Banana?",
        "answer": "It's a revolutionary AI image editing model that transforms photos using natural language prompts. This is currently the most powerful image editing model available, with exceptional consistency. It offers superior performance compared to Flux Kontext for consistent character editing and scene preservation.",
        "category": "general",
        "isActive": True,
        "order": 1
    },
    {
        "id": 2, 
        "question": "How does it work?",
        "answer": "Simply upload an image and describe your desired edits in natural language. The AI understands complex instructions like \"place the creature in a snowy mountain\" or \"imagine the whole face and create it\". It processes your text prompt and generates perfectly edited images.",
        "category": "usage",
        "isActive": True,
        "order": 2
    },
    {
        "id": 3,
        "question": "How is it better than Flux Kontext?",
        "answer": "This model excels in character consistency, scene blending, and one-shot editing. Users report it \"completely destroys\" Flux Kontext in preserving facial features and seamlessly integrating edits with backgrounds. It also supports multi-image context, making it ideal for creating consistent AI influencers.",
        "category": "comparison",
        "isActive": True,
        "order": 3
    },
    {
        "id": 4,
        "question": "Can I use it for commercial projects?", 
        "answer": "Yes! It's perfect for creating AI UGC content, social media campaigns, and marketing materials. Many users leverage it for creating consistent AI influencers and product photography. The high-quality outputs are suitable for professional use.",
        "category": "commercial",
        "isActive": True,
        "order": 4
    },
    {
        "id": 5,
        "question": "What types of edits can it handle?",
        "answer": "The editor handles complex edits including face completion, background changes, object placement, style transfers, and character modifications. It excels at understanding contextual instructions like \"place in a blizzard\" or \"create the whole face\" while maintaining photorealistic quality.",
        "category": "features",
        "isActive": True,
        "order": 5
    },
    {
        "id": 6,
        "question": "Where can I try Nano Banana?",
        "answer": "You can try nano-banana on LMArena or through our web interface. Simply upload your image, enter a text prompt describing your desired edits, and watch as nano-banana AI transforms your photo with incredible accuracy and consistency.",
        "category": "access", 
        "isActive": True,
        "order": 6
    }
]

@router.get("/features")
async def get_features():
    """Get application features"""
    try:
        active_features = [f for f in mock_features if f["isActive"]]
        
        return {
            "success": True,
            "features": active_features
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/reviews")
async def get_reviews():
    """Get user reviews/testimonials"""
    try:
        # Sort by creation date, newest first
        sorted_reviews = sorted(mock_reviews, key=lambda x: x["createdAt"], reverse=True)
        
        return {
            "success": True,
            "reviews": sorted_reviews
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/faqs")
async def get_faqs(category: Optional[str] = None):
    """Get FAQ data"""
    try:
        active_faqs = [f for f in mock_faqs if f["isActive"]]
        
        if category:
            active_faqs = [f for f in active_faqs if f["category"] == category]
        
        # Sort by order
        sorted_faqs = sorted(active_faqs, key=lambda x: x["order"])
        
        categories = list(set(f["category"] for f in mock_faqs if f["isActive"]))
        
        return {
            "success": True,
            "faqs": sorted_faqs,
            "categories": categories
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/stats")
async def get_stats():
    """Get application statistics"""
    try:
        # Mock statistics - in real app would query database
        stats = {
            "totalGenerations": 12847,
            "publicGallery": 4,
            "averageProcessingTime": "1.2s",
            "modelVersion": "nano-banana-v1",
            "uptime": "operational",
            "lastUpdated": datetime.utcnow().isoformat()
        }
        
        return {
            "success": True,
            "stats": stats
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")