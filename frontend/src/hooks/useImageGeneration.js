import { useState, useCallback } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState(null);
  const [error, setError] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);

  // Generate session ID for tracking
  const getSessionId = () => {
    let sessionId = localStorage.getItem('nanobanana_session');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('nanobanana_session', sessionId);
    }
    return sessionId;
  };

  // Start image generation
  const generateImage = useCallback(async (prompt, mode = 'text-to-image', inputImage = null) => {
    try {
      setIsGenerating(true);
      setError(null);
      setGenerationStatus('starting');

      const sessionId = getSessionId();
      
      const response = await axios.post(`${API}/generate`, {
        prompt,
        mode,
        sessionId
      });

      if (response.data.success) {
        const generationId = response.data.generationId;
        setGenerationStatus('processing');
        
        // Poll for completion
        pollGenerationStatus(generationId);
        
        return generationId;
      } else {
        throw new Error(response.data.error || 'Generation failed');
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
        const response = await axios.get(`${API}/generate/${generationId}`);
        
        if (response.data.success) {
          const generation = response.data.generation;
          
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
      const formData = new FormData();
      formData.append('image', file);
      formData.append('sessionId', sessionId);

      const response = await axios.post(`${API}/generate/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        return response.data.file;
      } else {
        throw new Error(response.data.error || 'Upload failed');
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
      const response = await axios.get(`${API}/generate/history/${sessionId}`, {
        params: { limit, skip }
      });

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch history');
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