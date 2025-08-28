const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class FileService {
  constructor() {
    this.uploadsDir = path.join(__dirname, '../uploads');
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
    this.allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    this.ensureUploadsDirectory();
  }

  async ensureUploadsDirectory() {
    try {
      await fs.access(this.uploadsDir);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.mkdir(this.uploadsDir, { recursive: true });
        console.log('Created uploads directory:', this.uploadsDir);
      }
    }
  }

  /**
   * Save uploaded file
   * @param {Object} file - Uploaded file object
   * @param {string} sessionId - Session identifier
   * @returns {Promise<Object>} File information
   */
  async saveUploadedFile(file, sessionId) {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Generate unique filename
      const fileExtension = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(this.uploadsDir, fileName);

      // Save file
      await fs.writeFile(filePath, file.buffer);

      const fileInfo = {
        id: fileName.replace(fileExtension, ''),
        fileName: fileName,
        originalName: file.originalname,
        filePath: filePath,
        size: file.size,
        mimeType: file.mimetype,
        sessionId: sessionId,
        uploadedAt: new Date(),
        url: `/api/files/${fileName}`
      };

      console.log('File saved successfully:', fileInfo.fileName);
      return fileInfo;

    } catch (error) {
      console.error('File save error:', error);
      throw new Error('Failed to save uploaded file');
    }
  }

  /**
   * Get file by filename
   * @param {string} fileName 
   * @returns {Promise<Object>} File data and info
   */
  async getFile(fileName) {
    try {
      const filePath = path.join(this.uploadsDir, fileName);
      
      // Check if file exists
      await fs.access(filePath);
      
      const fileBuffer = await fs.readFile(filePath);
      const stats = await fs.stat(filePath);
      
      // Determine MIME type based on extension
      const ext = path.extname(fileName).toLowerCase();
      let mimeType = 'application/octet-stream';
      
      switch (ext) {
        case '.jpg':
        case '.jpeg':
          mimeType = 'image/jpeg';
          break;
        case '.png':
          mimeType = 'image/png';
          break;
        case '.webp':
          mimeType = 'image/webp';
          break;
      }

      return {
        buffer: fileBuffer,
        mimeType: mimeType,
        size: stats.size,
        fileName: fileName
      };

    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error('File not found');
      }
      console.error('File retrieval error:', error);
      throw new Error('Failed to retrieve file');
    }
  }

  /**
   * Delete file
   * @param {string} fileName 
   * @returns {Promise<boolean>} Success status
   */
  async deleteFile(fileName) {
    try {
      const filePath = path.join(this.uploadsDir, fileName);
      await fs.unlink(filePath);
      console.log('File deleted successfully:', fileName);
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('File already deleted or not found:', fileName);
        return true; // Consider it successful if file doesn't exist
      }
      console.error('File deletion error:', error);
      return false;
    }
  }

  /**
   * Clean up old files (older than specified days)
   * @param {number} days - Number of days to keep files
   */
  async cleanupOldFiles(days = 7) {
    try {
      const files = await fs.readdir(this.uploadsDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      for (const file of files) {
        const filePath = path.join(this.uploadsDir, file);
        const stats = await fs.stat(filePath);
        
        if (stats.mtime < cutoffDate) {
          await this.deleteFile(file);
          console.log('Cleaned up old file:', file);
        }
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }

  /**
   * Validate uploaded file
   * @param {Object} file 
   * @returns {Object} Validation result
   */
  validateFile(file) {
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    if (file.size > this.maxFileSize) {
      return { 
        valid: false, 
        error: `File too large. Maximum size is ${this.maxFileSize / 1024 / 1024}MB` 
      };
    }

    if (!this.allowedTypes.includes(file.mimetype)) {
      return { 
        valid: false, 
        error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed' 
      };
    }

    return { valid: true };
  }

  /**
   * Get file storage statistics
   * @returns {Promise<Object>} Storage stats
   */
  async getStorageStats() {
    try {
      const files = await fs.readdir(this.uploadsDir);
      let totalSize = 0;
      let fileCount = files.length;

      for (const file of files) {
        const filePath = path.join(this.uploadsDir, file);
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
      }

      return {
        fileCount,
        totalSize,
        totalSizeMB: Math.round(totalSize / 1024 / 1024 * 100) / 100,
        uploadsDirectory: this.uploadsDir
      };
    } catch (error) {
      console.error('Storage stats error:', error);
      return {
        fileCount: 0,
        totalSize: 0,
        totalSizeMB: 0,
        error: error.message
      };
    }
  }
}

module.exports = new FileService();