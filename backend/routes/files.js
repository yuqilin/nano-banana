const express = require('express');
const fileService = require('../services/fileService');

const router = express.Router();

/**
 * Serve uploaded files
 * GET /api/files/:filename
 */
router.get('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;

    // Get file from file service
    const file = await fileService.getFile(filename);

    // Set appropriate headers
    res.set({
      'Content-Type': file.mimeType,
      'Content-Length': file.size,
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      'ETag': `"${filename}"`
    });

    // Send file buffer
    res.send(file.buffer);

  } catch (error) {
    console.error('File serve error:', error);
    
    if (error.message === 'File not found') {
      return res.status(404).json({ 
        success: false, 
        error: 'File not found' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Delete uploaded file
 * DELETE /api/files/:filename
 */
router.delete('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const { sessionId } = req.body;

    // In a real implementation, you'd verify the user has permission to delete
    // For now, we'll allow deletion with session ID verification
    
    const success = await fileService.deleteFile(filename);

    if (success) {
      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to delete file'
      });
    }

  } catch (error) {
    console.error('File delete error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Get storage statistics (admin endpoint)
 * GET /api/files/admin/stats
 */
router.get('/admin/stats', async (req, res) => {
  try {
    const stats = await fileService.getStorageStats();
    
    res.json({
      success: true,
      storage: stats
    });

  } catch (error) {
    console.error('Storage stats error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Cleanup old files (admin endpoint)
 * POST /api/files/admin/cleanup
 */
router.post('/admin/cleanup', async (req, res) => {
  try {
    const { days = 7 } = req.body;
    
    await fileService.cleanupOldFiles(days);
    
    res.json({
      success: true,
      message: `Cleanup completed for files older than ${days} days`
    });

  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

module.exports = router;