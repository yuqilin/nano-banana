from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, Response
from pathlib import Path
import os
import mimetypes

router = APIRouter(prefix="/files", tags=["files"])

# Configure uploads directory
UPLOADS_DIR = Path(__file__).parent.parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

@router.get("/{filename}")
async def serve_file(filename: str):
    """Serve uploaded files"""
    try:
        file_path = UPLOADS_DIR / filename
        
        # Check if file exists
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        # Get MIME type
        mime_type, _ = mimetypes.guess_type(str(file_path))
        if not mime_type:
            mime_type = "application/octet-stream"
        
        # Return file with appropriate headers
        return FileResponse(
            path=file_path,
            media_type=mime_type,
            headers={
                "Cache-Control": "public, max-age=86400",  # Cache for 24 hours
                "ETag": f'"{filename}"'
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.delete("/{filename}")
async def delete_file(filename: str):
    """Delete uploaded file"""
    try:
        file_path = UPLOADS_DIR / filename
        
        if file_path.exists():
            os.remove(file_path)
            return {
                "success": True,
                "message": "File deleted successfully"
            }
        else:
            # File doesn't exist, consider it successful
            return {
                "success": True,
                "message": "File already deleted or not found"
            }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/admin/stats")
async def get_storage_stats():
    """Get storage statistics"""
    try:
        total_files = 0
        total_size = 0
        
        if UPLOADS_DIR.exists():
            for file_path in UPLOADS_DIR.iterdir():
                if file_path.is_file():
                    total_files += 1
                    total_size += file_path.stat().st_size
        
        return {
            "success": True,
            "storage": {
                "fileCount": total_files,
                "totalSize": total_size,
                "totalSizeMB": round(total_size / 1024 / 1024, 2),
                "uploadsDirectory": str(UPLOADS_DIR)
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/admin/cleanup")
async def cleanup_old_files(days: int = 7):
    """Cleanup old files"""
    try:
        import time
        from datetime import datetime, timedelta
        
        cutoff_time = time.time() - (days * 24 * 60 * 60)
        deleted_count = 0
        
        if UPLOADS_DIR.exists():
            for file_path in UPLOADS_DIR.iterdir():
                if file_path.is_file() and file_path.stat().st_mtime < cutoff_time:
                    os.remove(file_path)
                    deleted_count += 1
        
        return {
            "success": True,
            "message": f"Cleanup completed for files older than {days} days",
            "deletedFiles": deleted_count
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")