const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const ImageGeneration = require('../models/ImageGeneration');
const Gallery = require('../models/Gallery');
const aiService = require('../services/aiService');
const fileService = require('../services/fileService');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 9 // Maximum 9 files for batch processing
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

/**
 * Generate image from text prompt
 * POST /api/generate
 */
router.post('/', async (req, res) => {
  try {
    const { prompt, mode = 'text-to-image', sessionId } = req.body;

    // Validate input
    const errors = ImageGeneration.validate({ prompt, sessionId, mode });
    if (errors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: errors 
      });
    }

    // Additional AI service validation
    const aiErrors = aiService.validateGenerationParams(prompt, mode);
    if (aiErrors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid parameters', 
        details: aiErrors 
      });
    }

    // Create generation record
    const generation = new ImageGeneration({
      prompt,
      mode,
      sessionId: sessionId || uuidv4(),
      status: 'processing'
    });

    // Save to database
    const result = await req.db.collection('generations').insertOne(generation.toJSON());
    generation._id = result.insertedId;

    // Start AI generation (async)
    setImmediate(async () => {
      try {
        const aiResult = await aiService.generateImage(prompt, mode);
        
        if (aiResult.success) {
          generation.updateStatus('completed', aiResult.processingTime);
          generation.outputImages = aiResult.images;
          
          // Update in database
          await req.db.collection('generations').updateOne(
            { _id: generation._id },
            { $set: generation.toJSON() }
          );

          console.log('Generation completed:', generation._id.toString());
        } else {
          generation.updateStatus('failed');
          await req.db.collection('generations').updateOne(
            { _id: generation._id },
            { $set: generation.toJSON() }
          );
          console.error('Generation failed:', aiResult.error);
        }
      } catch (error) {
        console.error('Generation processing error:', error);
        generation.updateStatus('failed');
        await req.db.collection('generations').updateOne(
          { _id: generation._id },
          { $set: generation.toJSON() }
        );
      }
    });

    // Return immediate response with generation ID
    res.status(202).json({
      success: true,
      message: 'Generation started',
      generationId: generation._id.toString(),
      status: 'processing',
      estimatedTime: '0.8-2 seconds'
    });

  } catch (error) {
    console.error('Generate route error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Get generation status and result
 * GET /api/generate/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find generation in database
    const generation = await req.db.collection('generations').findOne({ 
      _id: req.db.ObjectId(id) 
    });

    if (!generation) {
      return res.status(404).json({ 
        success: false, 
        error: 'Generation not found' 
      });
    }

    res.json({
      success: true,
      generation: generation
    });

  } catch (error) {
    console.error('Get generation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Upload reference image for image-to-image generation
 * POST /api/generate/upload
 */
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No image file provided' 
      });
    }

    if (!sessionId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Session ID is required' 
      });
    }

    // Save uploaded file
    const fileInfo = await fileService.saveUploadedFile(req.file, sessionId);

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      file: {
        id: fileInfo.id,
        fileName: fileInfo.fileName,
        originalName: fileInfo.originalName,
        size: fileInfo.size,
        url: fileInfo.url,
        uploadedAt: fileInfo.uploadedAt
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Upload failed',
      message: error.message 
    });
  }
});

/**
 * Get generation history for a session
 * GET /api/generate/history/:sessionId
 */
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 20, skip = 0 } = req.query;

    const generations = await req.db.collection('generations')
      .find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .toArray();

    const total = await req.db.collection('generations').countDocuments({ sessionId });

    res.json({
      success: true,
      generations,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: (parseInt(skip) + parseInt(limit)) < total
      }
    });

  } catch (error) {
    console.error('History route error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Add generation to public gallery
 * POST /api/generate/:id/gallery
 */
router.post('/:id/gallery', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Validate input
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title must be at least 3 characters' 
      });
    }

    // Find the generation
    const generationData = await req.db.collection('generations').findOne({ 
      _id: req.db.ObjectId(id) 
    });

    if (!generationData) {
      return res.status(404).json({ 
        success: false, 
        error: 'Generation not found' 
      });
    }

    const generation = new ImageGeneration(generationData);

    if (!generation.isCompleted()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Generation is not completed yet' 
      });
    }

    // Create gallery item
    const galleryItem = Gallery.createFromGeneration(
      generation, 
      title.trim(), 
      description ? description.trim() : `Generated with: "${generation.prompt}"`
    );

    // Save to gallery collection
    const result = await req.db.collection('gallery').insertOne(galleryItem.toJSON());
    galleryItem._id = result.insertedId;

    res.status(201).json({
      success: true,
      message: 'Added to gallery successfully',
      galleryItem: galleryItem.toJSON()
    });

  } catch (error) {
    console.error('Gallery add error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router;