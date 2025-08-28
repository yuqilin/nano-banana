const { ObjectId } = require('mongodb');

class Gallery {
  constructor(galleryData) {
    this._id = galleryData._id || new ObjectId();
    this.userId = galleryData.userId || null;
    this.sessionId = galleryData.sessionId;
    this.title = galleryData.title;
    this.description = galleryData.description;
    this.image = galleryData.image;
    this.prompt = galleryData.prompt;
    this.isPublic = galleryData.isPublic !== undefined ? galleryData.isPublic : true;
    this.likes = galleryData.likes || 0;
    this.createdAt = galleryData.createdAt || new Date();
    this.metadata = {
      processingTime: galleryData.metadata?.processingTime || null,
      model: galleryData.metadata?.model || 'nano-banana-v1',
      featured: galleryData.metadata?.featured || false
    };
  }

  toJSON() {
    return {
      _id: this._id,
      userId: this.userId,
      sessionId: this.sessionId,
      title: this.title,
      description: this.description,
      image: this.image,
      prompt: this.prompt,
      isPublic: this.isPublic,
      likes: this.likes,
      createdAt: this.createdAt,
      metadata: this.metadata
    };
  }

  static validate(galleryData) {
    const errors = [];
    
    if (!galleryData.title || galleryData.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters');
    }
    
    if (!galleryData.image) {
      errors.push('Image URL is required');
    }
    
    if (!galleryData.prompt || galleryData.prompt.trim().length < 3) {
      errors.push('Prompt must be at least 3 characters');
    }
    
    return errors;
  }

  incrementLikes() {
    this.likes += 1;
  }

  setFeatured(featured = true) {
    this.metadata.featured = featured;
  }

  static createFromGeneration(generation, title, description) {
    if (!generation.isCompleted() || generation.outputImages.length === 0) {
      throw new Error('Cannot create gallery item from incomplete generation');
    }

    return new Gallery({
      userId: generation.userId,
      sessionId: generation.sessionId,
      title: title,
      description: description,
      image: generation.outputImages[0], // Use first generated image
      prompt: generation.prompt,
      isPublic: true,
      metadata: {
        processingTime: generation.processingTime,
        model: generation.metadata.model
      }
    });
  }
}

module.exports = Gallery;