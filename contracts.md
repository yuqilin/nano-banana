# Nano Banana AI Image Editor - Backend Integration Contracts

## Overview
This document outlines the backend implementation plan for the Nano Banana AI image editor clone, including API contracts, data models, and integration strategies.

## Current Mock Data (to be replaced)
- **Features**: Static feature cards in `mockData.js`
- **Showcase Images**: Static Unsplash images in `mockData.js`
- **User Reviews**: Static testimonials in `mockData.js`
- **FAQ Data**: Static Q&A in `mockData.js`
- **Image Generation**: No actual AI processing

## Backend Implementation Plan

### 1. Database Models

#### User Model
```javascript
{
  _id: ObjectId,
  email: String (unique),
  name: String,
  avatar?: String,
  createdAt: Date,
  subscription: {
    type: String, // 'free', 'pro'
    expiresAt?: Date
  },
  usage: {
    imagesGenerated: Number,
    monthlyLimit: Number
  }
}
```

#### Image Generation Model
```javascript
{
  _id: ObjectId,
  userId?: ObjectId, // null for anonymous users
  sessionId: String, // for anonymous tracking
  prompt: String,
  mode: String, // 'image-to-image', 'text-to-image'
  inputImage?: String, // base64 or file path
  outputImages: [String], // generated image URLs/paths
  status: String, // 'pending', 'processing', 'completed', 'failed'
  processingTime: Number, // in milliseconds
  createdAt: Date,
  metadata: {
    model: String, // 'nano-banana-v1'
    settings: Object
  }
}
```

#### Gallery Model
```javascript
{
  _id: ObjectId,
  userId?: ObjectId,
  sessionId: String,
  title: String,
  description: String,
  image: String,
  prompt: String,
  isPublic: Boolean,
  likes: Number,
  createdAt: Date
}
```

### 2. API Endpoints

#### Authentication (Optional for MVP)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

#### Image Generation
- `POST /api/generate` - Generate image from prompt
- `GET /api/generate/:id` - Get generation status
- `POST /api/upload` - Upload reference image
- `GET /api/history` - Get user's generation history

#### Gallery & Content
- `GET /api/gallery` - Get public showcase gallery
- `GET /api/features` - Get feature list (can be static or dynamic)
- `GET /api/reviews` - Get user reviews
- `GET /api/faqs` - Get FAQ data

#### File Management
- `POST /api/files/upload` - Upload files with chunking
- `GET /api/files/:id` - Serve generated images
- `DELETE /api/files/:id` - Delete user files

### 3. AI Integration Strategy

Since this is a clone and we don't have access to the actual Nano Banana model, we'll implement:

1. **Mock AI Processing** (Initial):
   - Simulate processing time (0.8-2 seconds)
   - Return pre-selected images based on prompt keywords
   - Generate realistic processing responses

2. **Future Integration Options**:
   - OpenAI DALL-E integration
   - Stability AI integration
   - Local Stable Diffusion setup
   - Custom image processing APIs

### 4. Frontend Integration Changes

#### Components to Update:
1. **Editor.jsx**:
   - Replace mock image generation with real API calls
   - Add real-time status updates
   - Implement file upload functionality
   - Add progress tracking

2. **Showcase.jsx**:
   - Fetch dynamic gallery from `/api/gallery`
   - Replace static images with user-generated content

3. **Features.jsx**:
   - Optionally fetch from `/api/features` for dynamic content

4. **Reviews.jsx**:
   - Fetch from `/api/reviews` for dynamic testimonials

5. **FAQ.jsx**:
   - Fetch from `/api/faqs` for dynamic Q&A

#### New Components Needed:
1. **AuthContext** - User authentication state management
2. **ImageViewer** - Modal for viewing generated images
3. **ProgressTracker** - Real-time generation progress
4. **ErrorBoundary** - Error handling for API failures

### 5. File Structure Updates

#### Backend Files to Create:
- `models/User.js` - User model
- `models/ImageGeneration.js` - Image generation model  
- `models/Gallery.js` - Gallery model
- `routes/auth.js` - Authentication routes
- `routes/generate.js` - Image generation routes
- `routes/gallery.js` - Gallery routes
- `routes/content.js` - Static content routes
- `middleware/auth.js` - Authentication middleware
- `middleware/upload.js` - File upload middleware
- `services/aiService.js` - AI generation service
- `services/fileService.js` - File management service

#### Frontend Updates:
- `contexts/AuthContext.js` - Authentication context
- `hooks/useImageGeneration.js` - Image generation hook
- `utils/api.js` - API utility functions
- `components/ImageViewer.jsx` - Image viewer modal
- `components/ProgressTracker.jsx` - Progress component

### 6. Implementation Priority

#### Phase 1 (Core Functionality):
1. Image generation API with mock AI processing
2. File upload and storage
3. Basic gallery functionality
4. Replace mock data in frontend

#### Phase 2 (Enhanced Features):
1. User authentication
2. Generation history
3. Public gallery with likes
4. Usage limits and subscriptions

#### Phase 3 (Advanced):
1. Real AI integration
2. Batch processing
3. Advanced image editing features
4. Social features and sharing

### 7. Environment Variables Needed
```
# AI Service (for future integration)
OPENAI_API_KEY=your_openai_key
STABILITY_API_KEY=your_stability_key

# File Storage
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# Database (already configured)
MONGO_URL=existing_mongo_connection
DB_NAME=existing_db_name

# Session Management
SESSION_SECRET=random_secret_key
JWT_SECRET=jwt_secret_key
```

## Integration Steps

1. **Create Backend Models and Routes**
2. **Implement Mock AI Service** 
3. **Add File Upload Capability**
4. **Update Frontend Components** to use real APIs
5. **Remove Mock Data** and replace with API calls
6. **Test End-to-End Functionality**
7. **Add Error Handling and Loading States**

This contracts file will guide the seamless integration between frontend and backend, ensuring all mock functionality is properly replaced with real backend services.