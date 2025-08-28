import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// Ensure HTTPS is used in production
const API_BASE = BACKEND_URL || window.location.origin;
const API = `${API_BASE}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

// Force HTTPS in production
apiClient.interceptors.request.use((config) => {
  // Ensure HTTPS URLs in production
  if (config.url && config.url.startsWith('http://') && window.location.protocol === 'https:') {
    config.url = config.url.replace('http://', 'https://');
  }
  if (config.baseURL && config.baseURL.startsWith('http://') && window.location.protocol === 'https:') {
    config.baseURL = config.baseURL.replace('http://', 'https://');
  }
  
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.url || config.baseURL + (config.url || '')}`);
  return config;
}, (error) => {
  console.error('API Request Error:', error);
  return Promise.reject(error);
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Content API functions
export const contentAPI = {
  async getFeatures() {
    const response = await apiClient.get('/content/features');
    return response.data;
  },

  async getReviews() {
    const response = await apiClient.get('/content/reviews');
    return response.data;
  },

  async getFAQs(category = null) {
    const params = category ? { category } : {};
    const response = await apiClient.get('/content/faqs', { params });
    return response.data;
  },

  async getStats() {
    const response = await apiClient.get('/content/stats');
    return response.data;
  }
};

// Gallery API functions
export const galleryAPI = {
  async getGallery(params = {}) {
    const response = await apiClient.get('/gallery', { params });
    return response.data;
  },

  async getFeaturedShowcase(limit = 4) {
    const response = await apiClient.get('/gallery/featured/showcase', {
      params: { limit }
    });
    return response.data;
  },

  async getGalleryItem(id) {
    const response = await apiClient.get(`/gallery/${id}`);
    return response.data;
  },

  async likeGalleryItem(id) {
    const response = await apiClient.post(`/gallery/${id}/like`);
    return response.data;
  },

  async searchGallery(query, params = {}) {
    const response = await apiClient.get('/gallery/search/query', {
      params: { q: query, ...params }
    });
    return response.data;
  }
};

// Generation API functions
export const generationAPI = {
  async generateImage(prompt, mode = 'text-to-image', sessionId) {
    const response = await apiClient.post('/generate', {
      prompt,
      mode,
      sessionId
    });
    return response.data;
  },

  async getGenerationStatus(generationId) {
    const response = await apiClient.get(`/generate/${generationId}`);
    return response.data;
  },

  async uploadImage(file, sessionId) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('sessionId', sessionId);

    const response = await apiClient.post('/generate/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  async getHistory(sessionId, params = {}) {
    const response = await apiClient.get(`/generate/history/${sessionId}`, { params });
    return response.data;
  },

  async addToGallery(generationId, title, description) {
    const response = await apiClient.post(`/generate/${generationId}/gallery`, {
      title,
      description
    });
    return response.data;
  }
};

// File API functions
export const fileAPI = {
  getFileUrl(filename) {
    return `${API}/files/${filename}`;
  },

  async deleteFile(filename, sessionId) {
    const response = await apiClient.delete(`/files/${filename}`, {
      data: { sessionId }
    });
    return response.data;
  },

  async getStorageStats() {
    const response = await apiClient.get('/files/admin/stats');
    return response.data;
  }
};

// Health check function
export const healthAPI = {
  async check() {
    const response = await apiClient.get('/health');
    return response.data;
  },

  async getInfo() {
    const response = await apiClient.get('/');
    return response.data;
  }
};

// Utility function to handle API errors consistently
export const handleAPIError = (error, defaultMessage = 'An error occurred') => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return defaultMessage;
};

// Utility function to get session ID
export const getSessionId = () => {
  let sessionId = localStorage.getItem('nanobanana_session');
  if (!sessionId) {
    // Generate UUID-like string without crypto API
    sessionId = 'xxxx-xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    localStorage.setItem('nanobanana_session', sessionId);
  }
  return sessionId;
};

export default apiClient;