from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime

# Import route modules
from routes_python.generate import router as generate_router
from routes_python.gallery import router as gallery_router
from routes_python.content import router as content_router
from routes_python.files import router as files_router
from routes_python.payments import router as payments_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(
    title="Nano Banana AI Image Editor API", 
    version="1.0.0",
    description="Advanced AI image editing with natural language prompts",
    redirect_slashes=False  # Disable automatic slash redirects
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models for backwards compatibility
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Basic health check endpoints
@api_router.get("/")
async def root():
    return {
        "message": "Nano Banana AI Image Editor API", 
        "version": "1.0.0", 
        "status": "operational",
        "features": ["Image Generation", "Gallery", "File Upload"]
    }

@api_router.get("/health")
async def health_check():
    try:
        # Test database connection
        await db.list_collection_names()
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.utcnow(),
            "services": ["API", "Database", "File Storage"]
        }
    except Exception as e:
        return {
            "status": "unhealthy", 
            "database": "disconnected",
            "error": str(e),
            "timestamp": datetime.utcnow()
        }

# Legacy status endpoints for backward compatibility
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include all routers
api_router.include_router(generate_router)
api_router.include_router(gallery_router)
api_router.include_router(content_router)
api_router.include_router(files_router)
api_router.include_router(payments_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the main API router in the app
app.include_router(api_router)

# Add database to app state
@app.on_event("startup")
async def startup_db_client():
    app.state.db = db

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
