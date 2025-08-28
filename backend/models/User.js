const { ObjectId } = require('mongodb');

class User {
  constructor(userData) {
    this._id = userData._id || new ObjectId();
    this.email = userData.email;
    this.name = userData.name;
    this.avatar = userData.avatar || null;
    this.createdAt = userData.createdAt || new Date();
    this.subscription = {
      type: userData.subscription?.type || 'free',
      expiresAt: userData.subscription?.expiresAt || null
    };
    this.usage = {
      imagesGenerated: userData.usage?.imagesGenerated || 0,
      monthlyLimit: userData.usage?.monthlyLimit || 10 // Free tier limit
    };
  }

  toJSON() {
    return {
      _id: this._id,
      email: this.email,
      name: this.name,
      avatar: this.avatar,
      createdAt: this.createdAt,
      subscription: this.subscription,
      usage: this.usage
    };
  }

  static validate(userData) {
    const errors = [];
    
    if (!userData.email || !userData.email.includes('@')) {
      errors.push('Valid email is required');
    }
    
    if (!userData.name || userData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }
    
    return errors;
  }

  canGenerateImage() {
    return this.usage.imagesGenerated < this.usage.monthlyLimit;
  }

  incrementUsage() {
    this.usage.imagesGenerated += 1;
  }
}

module.exports = User;