const express = require('express');
const Gallery = require('../models/Gallery');

const router = express.Router();

/**
 * Get public gallery images
 * GET /api/gallery
 */
router.get('/', async (req, res) => {
  try {
    const { 
      limit = 20, 
      skip = 0, 
      featured = false,
      sort = 'recent' // 'recent', 'popular', 'featured'
    } = req.query;

    // Build query
    const query = { isPublic: true };
    if (featured === 'true') {
      query['metadata.featured'] = true;
    }

    // Build sort criteria
    let sortCriteria = { createdAt: -1 }; // Default: recent first
    if (sort === 'popular') {
      sortCriteria = { likes: -1, createdAt: -1 };
    } else if (sort === 'featured') {
      sortCriteria = { 'metadata.featured': -1, createdAt: -1 };
    }

    const galleryItems = await req.db.collection('gallery')
      .find(query)
      .sort(sortCriteria)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .toArray();

    const total = await req.db.collection('gallery').countDocuments(query);

    res.json({
      success: true,
      gallery: galleryItems,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: (parseInt(skip) + parseInt(limit)) < total
      },
      filters: {
        featured: featured === 'true',
        sort
      }
    });

  } catch (error) {
    console.error('Gallery route error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Get single gallery item
 * GET /api/gallery/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const galleryItem = await req.db.collection('gallery').findOne({ 
      _id: req.db.ObjectId(id),
      isPublic: true 
    });

    if (!galleryItem) {
      return res.status(404).json({ 
        success: false, 
        error: 'Gallery item not found' 
      });
    }

    res.json({
      success: true,
      galleryItem
    });

  } catch (error) {
    console.error('Gallery item route error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Like a gallery item
 * POST /api/gallery/:id/like
 */
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;

    // Find and update the gallery item
    const result = await req.db.collection('gallery').findOneAndUpdate(
      { 
        _id: req.db.ObjectId(id),
        isPublic: true 
      },
      { 
        $inc: { likes: 1 } 
      },
      { 
        returnDocument: 'after' 
      }
    );

    if (!result.value) {
      return res.status(404).json({ 
        success: false, 
        error: 'Gallery item not found' 
      });
    }

    res.json({
      success: true,
      message: 'Liked successfully',
      likes: result.value.likes
    });

  } catch (error) {
    console.error('Gallery like error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Get featured gallery items for homepage showcase
 * GET /api/gallery/featured
 */
router.get('/featured/showcase', async (req, res) => {
  try {
    const { limit = 4 } = req.query;

    const featuredItems = await req.db.collection('gallery')
      .find({ 
        isPublic: true,
        'metadata.featured': true 
      })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .toArray();

    // If we don't have enough featured items, fill with recent popular ones
    if (featuredItems.length < parseInt(limit)) {
      const needed = parseInt(limit) - featuredItems.length;
      const excludeIds = featuredItems.map(item => item._id);
      
      const additionalItems = await req.db.collection('gallery')
        .find({ 
          isPublic: true,
          _id: { $nin: excludeIds }
        })
        .sort({ likes: -1, createdAt: -1 })
        .limit(needed)
        .toArray();
      
      featuredItems.push(...additionalItems);
    }

    res.json({
      success: true,
      showcase: featuredItems,
      count: featuredItems.length
    });

  } catch (error) {
    console.error('Featured showcase error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Search gallery items
 * GET /api/gallery/search
 */
router.get('/search/query', async (req, res) => {
  try {
    const { 
      q, // search query
      limit = 20, 
      skip = 0 
    } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ 
        success: false, 
        error: 'Search query must be at least 2 characters' 
      });
    }

    const searchRegex = new RegExp(q.trim(), 'i');
    
    const query = {
      isPublic: true,
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { prompt: searchRegex }
      ]
    };

    const results = await req.db.collection('gallery')
      .find(query)
      .sort({ likes: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .toArray();

    const total = await req.db.collection('gallery').countDocuments(query);

    res.json({
      success: true,
      results,
      query: q,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: (parseInt(skip) + parseInt(limit)) < total
      }
    });

  } catch (error) {
    console.error('Gallery search error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router;