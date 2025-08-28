const express = require('express');

const router = express.Router();

// Static content for the application
// In a real app, this could be dynamic and stored in the database

/**
 * Get application features
 * GET /api/content/features
 */
router.get('/features', async (req, res) => {
  try {
    const features = [
      {
        id: 1,
        title: "Natural Language Editing",
        description: "Edit images using simple text prompts. Nano-banana AI understands complex instructions like GPT for images",
        icon: "💬",
        color: "from-orange-400 to-orange-500",
        isActive: true
      },
      {
        id: 2,
        title: "Character Consistency",
        description: "Maintain perfect character details across edits. This model excels at preserving faces and identities",
        icon: "🎭",
        color: "from-orange-500 to-red-500",
        isActive: true
      },
      {
        id: 3,
        title: "Scene Preservation",
        description: "Seamlessly blend edits with original backgrounds. Superior scene fusion compared to Flux Kontext",
        icon: "🎨",
        color: "from-red-500 to-pink-500",
        isActive: true
      },
      {
        id: 4,
        title: "One-Shot Editing",
        description: "Perfect results in a single attempt. Nano-banana solves one-shot image editing challenges effortlessly",
        icon: "🎯",
        color: "from-orange-400 to-yellow-500",
        isActive: true
      },
      {
        id: 5,
        title: "Multi-Image Context",
        description: "Process multiple images simultaneously. Support for advanced multi-image editing workflows",
        icon: "📚",
        color: "from-blue-400 to-blue-500",
        isActive: true
      },
      {
        id: 6,
        title: "AI UGC Creation",
        description: "Create consistent AI influencers and UGC content. Perfect for social media and marketing campaigns",
        icon: "⭐",
        color: "from-purple-400 to-purple-500",
        isActive: true
      }
    ];

    res.json({
      success: true,
      features: features.filter(f => f.isActive)
    });

  } catch (error) {
    console.error('Features route error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Get user reviews/testimonials
 * GET /api/content/reviews
 */
router.get('/reviews', async (req, res) => {
  try {
    const reviews = [
      {
        id: 1,
        name: "AIArtistPro",
        role: "Digital Creator",
        content: "This editor completely changed my workflow. The character consistency is incredible - miles ahead of Flux Kontext!",
        avatar: "AP",
        rating: 5,
        isVerified: true,
        createdAt: new Date('2024-01-15')
      },
      {
        id: 2,
        name: "ContentCreator",
        role: "UGC Specialist", 
        content: "Creating consistent AI influencers has never been easier. It maintains perfect face details across edits!",
        avatar: "CC",
        rating: 5,
        isVerified: true,
        createdAt: new Date('2024-01-18')
      },
      {
        id: 3,
        name: "PhotoEditor",
        role: "Professional Editor",
        content: "One-shot editing is basically solved with this tool. The scene blending is so natural and realistic!",
        avatar: "PE",
        rating: 5,
        isVerified: true,
        createdAt: new Date('2024-01-20')
      }
    ];

    res.json({
      success: true,
      reviews: reviews.sort((a, b) => b.createdAt - a.createdAt)
    });

  } catch (error) {
    console.error('Reviews route error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Get FAQ data
 * GET /api/content/faqs
 */
router.get('/faqs', async (req, res) => {
  try {
    const faqs = [
      {
        id: 1,
        question: "What is Nano Banana?",
        answer: "It's a revolutionary AI image editing model that transforms photos using natural language prompts. This is currently the most powerful image editing model available, with exceptional consistency. It offers superior performance compared to Flux Kontext for consistent character editing and scene preservation.",
        category: "general",
        isActive: true,
        order: 1
      },
      {
        id: 2,
        question: "How does it work?",
        answer: "Simply upload an image and describe your desired edits in natural language. The AI understands complex instructions like \"place the creature in a snowy mountain\" or \"imagine the whole face and create it\". It processes your text prompt and generates perfectly edited images.",
        category: "usage",
        isActive: true,
        order: 2
      },
      {
        id: 3,
        question: "How is it better than Flux Kontext?",
        answer: "This model excels in character consistency, scene blending, and one-shot editing. Users report it \"completely destroys\" Flux Kontext in preserving facial features and seamlessly integrating edits with backgrounds. It also supports multi-image context, making it ideal for creating consistent AI influencers.",
        category: "comparison",
        isActive: true,
        order: 3
      },
      {
        id: 4,
        question: "Can I use it for commercial projects?",
        answer: "Yes! It's perfect for creating AI UGC content, social media campaigns, and marketing materials. Many users leverage it for creating consistent AI influencers and product photography. The high-quality outputs are suitable for professional use.",
        category: "commercial",
        isActive: true,
        order: 4
      },
      {
        id: 5,
        question: "What types of edits can it handle?",
        answer: "The editor handles complex edits including face completion, background changes, object placement, style transfers, and character modifications. It excels at understanding contextual instructions like \"place in a blizzard\" or \"create the whole face\" while maintaining photorealistic quality.",
        category: "features",
        isActive: true,
        order: 5
      },
      {
        id: 6,
        question: "Where can I try Nano Banana?",
        answer: "You can try nano-banana on LMArena or through our web interface. Simply upload your image, enter a text prompt describing your desired edits, and watch as nano-banana AI transforms your photo with incredible accuracy and consistency.",
        category: "access",
        isActive: true,
        order: 6
      }
    ];

    const { category } = req.query;
    
    let filteredFaqs = faqs.filter(faq => faq.isActive);
    
    if (category) {
      filteredFaqs = filteredFaqs.filter(faq => faq.category === category);
    }

    res.json({
      success: true,
      faqs: filteredFaqs.sort((a, b) => a.order - b.order),
      categories: ['general', 'usage', 'comparison', 'commercial', 'features', 'access']
    });

  } catch (error) {
    console.error('FAQs route error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Get application statistics
 * GET /api/content/stats
 */
router.get('/stats', async (req, res) => {
  try {
    // Get real statistics from database
    const [generationsCount, galleryCount] = await Promise.all([
      req.db.collection('generations').countDocuments({ status: 'completed' }),
      req.db.collection('gallery').countDocuments({ isPublic: true })
    ]);

    const stats = {
      totalGenerations: generationsCount,
      publicGallery: galleryCount,
      averageProcessingTime: '1.2s', // Could calculate this from actual data
      modelVersion: 'nano-banana-v1',
      uptime: process.uptime(),
      lastUpdated: new Date()
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Stats route error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router;