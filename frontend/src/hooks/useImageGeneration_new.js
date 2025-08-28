import { useState, useCallback } from 'react';
import { generationAPI, getSessionId } from '../utils/api';

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState(null);
  const [error, setError] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);

  // Start image generation
  const generateImage = useCallback(async (prompt, mode = 'text-to-image', inputImage = null) => {
    try {
      setIsGenerating(true);
      setError(null);
      setGenerationStatus('starting');

      const sessionId = getSessionId();
      
      const response = await generationAPI.generateImage(prompt, mode, sessionId);

      if (response.success) {
        const generationId = response.generationId;
        setGenerationStatus('processing');
        
        // Poll for completion
        pollGenerationStatus(generationId);
        
        return generationId;
      } else {
        throw new Error(response.error || 'Generation failed');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.response?.data?.detail || err.message || 'Generation failed');
      setIsGenerating(false);
      setGenerationStatus('failed');
    }
  }, []);

  // Poll for generation status
  const pollGenerationStatus = async (generationId) => {
    const maxAttempts = 30; // 30 seconds maximum
    let attempts = 0;

    const poll = async () => {
      try {
        attempts++;
        const response = await generationAPI.getGenerationStatus(generationId);
        
        if (response.success) {
          const generation = response.generation;
          
          if (generation.status === 'completed') {
            setGeneratedImages(generation.outputImages || []);
            setGenerationStatus('completed');
            setIsGenerating(false);
          } else if (generation.status === 'failed') {
            setError('Generation failed');
            setGenerationStatus('failed');
            setIsGenerating(false);
          } else if (attempts < maxAttempts) {
            // Continue polling
            setTimeout(poll, 1000);
          } else {
            setError('Generation timeout');
            setGenerationStatus('failed');
            setIsGenerating(false);
          }
        }
      } catch (err) {
        console.error('Status polling error:', err);
        if (attempts < maxAttempts) {
          setTimeout(poll, 1000);
        } else {
          setError('Failed to check generation status');
          setGenerationStatus('failed');
          setIsGenerating(false);
        }
      }
    };

    // Start polling after a short delay
    setTimeout(poll, 1000);
  };

  // Upload reference image
  const uploadImage = useCallback(async (file) => {
    try {
      const sessionId = getSessionId();
      const response = await generationAPI.uploadImage(file, sessionId);

      if (response.success) {
        return response.file;
      } else {
        throw new Error(response.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      throw new Error(err.response?.data?.detail || err.message || 'Upload failed');
    }
  }, []);

  // Get generation history
  const getHistory = useCallback(async (limit = 20, skip = 0) => {
    try {
      const sessionId = getSessionId();
      const response = await generationAPI.getHistory(sessionId, { limit, skip });

      if (response.success) {
        return response;
      } else {
        throw new Error(response.error || 'Failed to fetch history');
      }
    } catch (err) {
      console.error('History fetch error:', err);
      throw new Error(err.response?.data?.detail || err.message || 'Failed to fetch history');
    }
  }, []);

  // Reset generation state
  const resetGeneration = useCallback(() => {
    setIsGenerating(false);
    setGenerationStatus(null);
    setError(null);
    setGeneratedImages([]);
  }, []);

  return {
    isGenerating,
    generationStatus,
    error,
    generatedImages,
    generateImage,
    uploadImage,
    getHistory,
    resetGeneration
  };
};