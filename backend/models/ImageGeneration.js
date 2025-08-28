const { ObjectId } = require('mongodb');

class ImageGeneration {
  constructor(generationData) {
    this._id = generationData._id || new ObjectId();
    this.userId = generationData.userId || null;
    this.sessionId = generationData.sessionId;
    this.prompt = generationData.prompt;
    this.mode = generationData.mode || 'text-to-image'; // 'image-to-image', 'text-to-image'
    this.inputImage = generationData.inputImage || null;
    this.outputImages = generationData.outputImages || [];
    this.status = generationData.status || 'pending'; // 'pending', 'processing', 'completed', 'failed'
    this.processingTime = generationData.processingTime || null;
    this.createdAt = generationData.createdAt || new Date();
    this.metadata = {
      model: generationData.metadata?.model || 'nano-banana-v1',
      settings: generationData.metadata?.settings || {}
    };
  }

  toJSON() {
    return {
      _id: this._id,
      userId: this.userId,
      sessionId: this.sessionId,
      prompt: this.prompt,
      mode: this.mode,
      inputImage: this.inputImage,
      outputImages: this.outputImages,
      status: this.status,
      processingTime: this.processingTime,
      createdAt: this.createdAt,
      metadata: this.metadata
    };
  }

  static validate(generationData) {
    const errors = [];
    
    if (!generationData.prompt || generationData.prompt.trim().length < 3) {
      errors.push('Prompt must be at least 3 characters');
    }
    
    if (!generationData.sessionId) {
      errors.push('Session ID is required');
    }
    
    if (generationData.mode && !['image-to-image', 'text-to-image'].includes(generationData.mode)) {
      errors.push('Invalid generation mode');
    }
    
    return errors;
  }

  updateStatus(status, processingTime = null) {
    this.status = status;
    if (processingTime !== null) {
      this.processingTime = processingTime;
    }
  }

  addOutputImage(imageUrl) {
    this.outputImages.push(imageUrl);
  }

  isCompleted() {
    return this.status === 'completed';
  }

  isFailed() {
    return this.status === 'failed';
  }
}

module.exports = ImageGeneration;