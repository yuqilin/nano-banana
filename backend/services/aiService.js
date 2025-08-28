const fs = require('fs').promises;
const path = require('path');

class AIService {
  constructor() {
    // Mock image pool for different prompt categories
    this.mockImages = {
      mountain: [
        'https://images.unsplash.com/photo-1494806812796-244fe51b774d?w=800&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80'
      ],
      garden: [
        'https://images.unsplash.com/photo-1563714193017-5a5fb60bc02b?w=800&q=80',
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
      ],
      aurora: [
        'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
        'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=800&q=80',
        'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&q=80'
      ],
      beach: [
        'https://images.unsplash.com/photo-1665613252734-7ed473dce464?w=800&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80'
      ],
      city: [
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
        'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80',
        'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=800&q=80'
      ],
      default: [
        'https://images.unsplash.com/photo-1518709268805-4e9042af2ac1?w=800&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80'
      ]
    };
  }

  /**
   * Generate image from text prompt (mock implementation)
   * @param {string} prompt - Text prompt for image generation
   * @param {string} mode - Generation mode ('text-to-image' or 'image-to-image')
   * @param {string} inputImage - Base64 or URL of input image (for image-to-image)
   * @returns {Promise<Object>} Generation result
   */
  async generateImage(prompt, mode = 'text-to-image', inputImage = null) {
    const startTime = Date.now();
    
    try {
      // Simulate processing time (0.8 - 2 seconds like Nano Banana)
      const processingTime = Math.random() * 1200 + 800;
      await this.delay(processingTime);
      
      // Categorize prompt to select appropriate mock image
      const category = this.categorizePrompt(prompt);
      const imagePool = this.mockImages[category] || this.mockImages.default;
      
      // Select random image from category
      const selectedImage = imagePool[Math.floor(Math.random() * imagePool.length)];
      
      const endTime = Date.now();
      const actualProcessingTime = endTime - startTime;
      
      return {
        success: true,
        images: [selectedImage],
        processingTime: actualProcessingTime,
        metadata: {
          model: 'nano-banana-v1-mock',
          category: category,
          prompt: prompt,
          mode: mode
        }
      };
      
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        success: false,
        error: 'Image generation failed',
        processingTime: Date.now() - startTime
      };
    }
  }

  /**
   * Categorize prompt to select appropriate mock images
   * @param {string} prompt 
   * @returns {string} Category name
   */
  categorizePrompt(prompt) {
    const lowercasePrompt = prompt.toLowerCase();
    
    if (lowercasePrompt.includes('mountain') || lowercasePrompt.includes('peak') || lowercasePrompt.includes('snow')) {
      return 'mountain';
    }
    if (lowercasePrompt.includes('garden') || lowercasePrompt.includes('flower') || lowercasePrompt.includes('plant')) {
      return 'garden';
    }
    if (lowercasePrompt.includes('aurora') || lowercasePrompt.includes('northern light') || lowercasePrompt.includes('borealis')) {
      return 'aurora';
    }
    if (lowercasePrompt.includes('beach') || lowercasePrompt.includes('ocean') || lowercasePrompt.includes('sea')) {
      return 'beach';
    }
    if (lowercasePrompt.includes('city') || lowercasePrompt.includes('urban') || lowercasePrompt.includes('building')) {
      return 'city';
    }
    
    return 'default';
  }

  /**
   * Process uploaded image for image-to-image generation
   * @param {string} imagePath - Path to uploaded image
   * @param {string} prompt - Text prompt for modifications
   * @returns {Promise<Object>} Processing result
   */
  async processImageToImage(imagePath, prompt) {
    try {
      // In real implementation, this would process the uploaded image
      // For now, we'll just generate a new image based on the prompt
      return await this.generateImage(prompt, 'image-to-image', imagePath);
    } catch (error) {
      console.error('Image-to-Image processing error:', error);
      return {
        success: false,
        error: 'Image processing failed'
      };
    }
  }

  /**
   * Get generation status (for real-time updates)
   * @param {string} generationId 
   * @returns {Promise<Object>} Status information
   */
  async getGenerationStatus(generationId) {
    // In a real implementation, this would check the actual generation status
    // For mock, we'll return completed status after a short delay
    return {
      id: generationId,
      status: 'completed',
      progress: 100,
      estimatedTime: 0
    };
  }

  /**
   * Utility function to simulate async delay
   * @param {number} ms - Milliseconds to delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Validate image generation parameters
   * @param {string} prompt 
   * @param {string} mode 
   * @returns {Array} Array of validation errors
   */
  validateGenerationParams(prompt, mode) {
    const errors = [];
    
    if (!prompt || prompt.trim().length < 3) {
      errors.push('Prompt must be at least 3 characters long');
    }
    
    if (prompt && prompt.length > 500) {
      errors.push('Prompt must be less than 500 characters');
    }
    
    if (mode && !['text-to-image', 'image-to-image'].includes(mode)) {
      errors.push('Invalid generation mode');
    }
    
    return errors;
  }
}

module.exports = new AIService();