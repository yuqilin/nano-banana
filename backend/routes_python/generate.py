from fastapi import APIRouter, HTTPException, UploadFile, File, Form, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List
import uuid
import asyncio
import json
from datetime import datetime
import aiofiles
import os
from pathlib import Path

# Import the real AI service
from services.aiService import aiService

router = APIRouter(prefix="/generate", tags=["generation"])

# Pydantic models
class GenerateRequest(BaseModel):
    prompt: str
    mode: str = "text-to-image"
    sessionId: Optional[str] = None

class GenerateResponse(BaseModel):
    success: bool
    message: str
    generationId: str
    status: str
    estimatedTime: str

class GenerationStatus(BaseModel):
    success: bool
    generation: dict

# Mock AI service equivalent to Node.js version (to be removed)
class MockAIService:
    def __init__(self):
        self.mock_images = {
            "mountain": [
                "https://images.unsplash.com/photo-1494806812796-244fe51b774d?w=800&q=80",
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
            ],
            "garden": [
                "https://images.unsplash.com/photo-1563714193017-5a5fb60bc02b?w=800&q=80",
                "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
            ],
            "aurora": [
                "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
                "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=800&q=80",
            ],
            "default": [
                "https://images.unsplash.com/photo-1518709268805-4e9042af2ac1?w=800&q=80",
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
            ]
        }

    def categorize_prompt(self, prompt: str) -> str:
        prompt_lower = prompt.lower()
        if any(word in prompt_lower for word in ['mountain', 'peak', 'snow']):
            return 'mountain'
        elif any(word in prompt_lower for word in ['garden', 'flower', 'plant']):
            return 'garden'
        elif any(word in prompt_lower for word in ['aurora', 'northern light', 'borealis']):
            return 'aurora'
        return 'default'

    async def generate_image(self, prompt: str, mode: str = "text-to-image"):
        # Simulate processing time
        processing_time = 0.8 + (1.2 * __import__('random').random())  # 0.8-2 seconds
        await asyncio.sleep(processing_time)
        
        category = self.categorize_prompt(prompt)
        image_pool = self.mock_images.get(category, self.mock_images['default'])
        selected_image = __import__('random').choice(image_pool)
        
        return {
            'success': True,
            'images': [selected_image],
            'processingTime': processing_time * 1000,  # Convert to milliseconds
            'metadata': {
                'model': 'nano-banana-v1-mock',
                'category': category,
                'prompt': prompt,
                'mode': mode
            }
        }

ai_service = MockAIService()

@router.post("/", response_model=GenerateResponse)
async def generate_image(request: GenerateRequest, background_tasks: BackgroundTasks):
    """Generate image from text prompt"""
    try:
        # Validate input
        if not request.prompt or len(request.prompt.strip()) < 3:
            raise HTTPException(status_code=400, detail="Prompt must be at least 3 characters")
        
        if len(request.prompt) > 500:
            raise HTTPException(status_code=400, detail="Prompt must be less than 500 characters")
        
        # Generate session ID if not provided
        session_id = request.sessionId or str(uuid.uuid4())
        
        # Create generation record
        generation_id = str(uuid.uuid4())
        generation_data = {
            "_id": generation_id,
            "prompt": request.prompt,
            "mode": request.mode,
            "sessionId": session_id,
            "status": "processing",
            "createdAt": datetime.utcnow(),
            "outputImages": [],
            "processingTime": None
        }
        
        # In a real app, save to database here
        # await db.generations.insert_one(generation_data)
        
        # Start background processing
        background_tasks.add_task(process_generation, generation_id, request.prompt, request.mode)
        
        return GenerateResponse(
            success=True,
            message="Generation started",
            generationId=generation_id,
            status="processing",
            estimatedTime="0.8-2 seconds"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

async def process_generation(generation_id: str, prompt: str, mode: str):
    """Background task to process image generation"""
    try:
        # Simulate AI processing
        result = await ai_service.generate_image(prompt, mode)
        
        # In a real app, update database here
        # Update generation status to completed with results
        print(f"Generation {generation_id} completed: {result['images'][0]}")
        
    except Exception as e:
        print(f"Generation {generation_id} failed: {str(e)}")
        # In a real app, update database status to failed

@router.get("/{generation_id}", response_model=GenerationStatus)
async def get_generation_status(generation_id: str):
    """Get generation status and result"""
    try:
        # In a real app, fetch from database
        # For demo, return mock completed status
        mock_generation = {
            "_id": generation_id,
            "status": "completed",
            "prompt": "A beautiful landscape",
            "outputImages": ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"],
            "processingTime": 1200,
            "createdAt": datetime.utcnow().isoformat()
        }
        
        return GenerationStatus(success=True, generation=mock_generation)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/upload")
async def upload_reference_image(
    image: UploadFile = File(...),
    sessionId: str = Form(...)
):
    """Upload reference image for image-to-image generation"""
    try:
        # Validate file
        if not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="Only image files are allowed")
        
        if image.size > 10 * 1024 * 1024:  # 10MB
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB")
        
        # Generate unique filename
        file_extension = Path(image.filename).suffix
        filename = f"{uuid.uuid4()}{file_extension}"
        
        # Ensure uploads directory exists
        uploads_dir = Path(__file__).parent.parent / "uploads"
        uploads_dir.mkdir(exist_ok=True)
        
        # Save file
        file_path = uploads_dir / filename
        async with aiofiles.open(file_path, 'wb') as f:
            content = await image.read()
            await f.write(content)
        
        return {
            "success": True,
            "message": "Image uploaded successfully",
            "file": {
                "id": filename.replace(file_extension, ""),
                "fileName": filename,
                "originalName": image.filename,
                "size": len(content),
                "url": f"/api/files/{filename}",
                "uploadedAt": datetime.utcnow().isoformat()
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.get("/history/{session_id}")
async def get_generation_history(session_id: str, limit: int = 20, skip: int = 0):
    """Get generation history for a session"""
    try:
        # In a real app, fetch from database
        # For demo, return empty history
        return {
            "success": True,
            "generations": [],
            "pagination": {
                "total": 0,
                "limit": limit,
                "skip": skip,
                "hasMore": False
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")