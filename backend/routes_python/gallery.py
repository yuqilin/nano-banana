from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

router = APIRouter(prefix="/gallery", tags=["gallery"])

class GalleryItem(BaseModel):
    id: str
    title: str
    description: str
    image: str
    prompt: str
    likes: int
    createdAt: datetime
    processingTime: Optional[float] = None

# Mock gallery data - in real app this would come from database
mock_gallery_items = [
    {
        "id": "1",
        "title": "Ultra-Fast Mountain Generation",
        "description": "Created in 0.8 seconds with Nano Banana's optimized neural engine",
        "image": "https://images.unsplash.com/photo-1494806812796-244fe51b774d?w=800&q=80",
        "prompt": "A majestic snow-capped mountain range at golden hour",
        "likes": 42,
        "createdAt": datetime.now(),
        "processingTime": 0.8,
        "metadata": {"featured": True}
    },
    {
        "id": "2", 
        "title": "Instant Garden Creation",
        "description": "Complex scene rendered in milliseconds using Nano Banana technology",
        "image": "https://images.unsplash.com/photo-1563714193017-5a5fb60bc02b?w=800&q=80",
        "prompt": "A lush garden pathway with vibrant flowers",
        "likes": 38,
        "createdAt": datetime.now(),
        "processingTime": 1.2,
        "metadata": {"featured": True}
    },
    {
        "id": "3",
        "title": "Real-time Beach Synthesis", 
        "description": "Nano Banana delivers photorealistic results at lightning speed",
        "image": "https://images.unsplash.com/photo-1665613252734-7ed473dce464?w=800&q=80",
        "prompt": "A pristine beach with crystal clear waters",
        "likes": 35,
        "createdAt": datetime.now(),
        "processingTime": 1.0,
        "metadata": {"featured": False}
    },
    {
        "id": "4",
        "title": "Rapid Aurora Generation",
        "description": "Advanced effects processed instantly with Nano Banana AI", 
        "image": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
        "prompt": "Northern lights dancing over a snowy landscape",
        "likes": 56,
        "createdAt": datetime.now(),
        "processingTime": 0.9,
        "metadata": {"featured": True}
    }
]

@router.get("/")
async def get_gallery(
    limit: int = 20, 
    skip: int = 0, 
    featured: bool = False,
    sort: str = "recent"
):
    """Get public gallery images"""
    try:
        # Filter and sort gallery items
        items = mock_gallery_items.copy()
        
        if featured:
            items = [item for item in items if item.get("metadata", {}).get("featured", False)]
        
        # Sort items
        if sort == "popular":
            items.sort(key=lambda x: x["likes"], reverse=True)
        elif sort == "featured":
            items.sort(key=lambda x: (x.get("metadata", {}).get("featured", False), x["likes"]), reverse=True)
        else:  # recent
            items.sort(key=lambda x: x["createdAt"], reverse=True)
        
        # Pagination
        total = len(items)
        paginated_items = items[skip:skip + limit]
        
        return {
            "success": True,
            "gallery": paginated_items,
            "pagination": {
                "total": total,
                "limit": limit,
                "skip": skip,
                "hasMore": (skip + limit) < total
            },
            "filters": {
                "featured": featured,
                "sort": sort
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/featured/showcase")
async def get_featured_showcase(limit: int = 4):
    """Get featured gallery items for homepage showcase"""
    try:
        # Get featured items
        featured_items = [
            item for item in mock_gallery_items 
            if item.get("metadata", {}).get("featured", False)
        ]
        
        # Sort by likes and limit
        featured_items.sort(key=lambda x: x["likes"], reverse=True)
        showcase_items = featured_items[:limit]
        
        return {
            "success": True,
            "showcase": showcase_items,
            "count": len(showcase_items)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/{gallery_id}")
async def get_gallery_item(gallery_id: str):
    """Get single gallery item"""
    try:
        # Find gallery item
        gallery_item = next((item for item in mock_gallery_items if item["id"] == gallery_id), None)
        
        if not gallery_item:
            raise HTTPException(status_code=404, detail="Gallery item not found")
        
        return {
            "success": True,
            "galleryItem": gallery_item
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/{gallery_id}/like")
async def like_gallery_item(gallery_id: str):
    """Like a gallery item"""
    try:
        # Find and update gallery item
        gallery_item = next((item for item in mock_gallery_items if item["id"] == gallery_id), None)
        
        if not gallery_item:
            raise HTTPException(status_code=404, detail="Gallery item not found")
        
        # Increment likes (in real app, this would update database)
        gallery_item["likes"] += 1
        
        return {
            "success": True,
            "message": "Liked successfully",
            "likes": gallery_item["likes"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/search/query")
async def search_gallery(q: str, limit: int = 20, skip: int = 0):
    """Search gallery items"""
    try:
        if not q or len(q.strip()) < 2:
            raise HTTPException(status_code=400, detail="Search query must be at least 2 characters")
        
        # Search in title, description, and prompt
        query = q.lower()
        results = []
        
        for item in mock_gallery_items:
            if (query in item["title"].lower() or 
                query in item["description"].lower() or 
                query in item["prompt"].lower()):
                results.append(item)
        
        # Sort by likes
        results.sort(key=lambda x: x["likes"], reverse=True)
        
        # Pagination
        total = len(results)
        paginated_results = results[skip:skip + limit]
        
        return {
            "success": True,
            "results": paginated_results,
            "query": q,
            "pagination": {
                "total": total,
                "limit": limit,
                "skip": skip,
                "hasMore": (skip + limit) < total
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")