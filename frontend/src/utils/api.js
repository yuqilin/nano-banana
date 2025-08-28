import axios from 'axios';

// Get backend URL and ensure HTTPS
let BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Force HTTPS if we're running on HTTPS
if (!BACKEND_URL) {
  BACKEND_URL = window.location.origin;
}

// Ensure HTTPS in production
if (BACKEND_URL.startsWith('http://') && (window.location.protocol === 'https:' || BACKEND_URL.includes('emergentagent.com'))) {
  BACKEND_URL = BACKEND_URL.replace('http://', 'https://');
}

const API_BASE = BACKEND_URL;
const API = `${API_BASE}/api`;

console.log('API Base URL:', API); // Debug log

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

// Force HTTPS in production - Enhanced interceptor
apiClient.interceptors.request.use((config) => {
  // Ensure the baseURL is HTTPS
  if (config.baseURL && config.baseURL.startsWith('http://') && 
      (window.location.protocol === 'https:' || config.baseURL.includes('emergentagent.com'))) {
    config.baseURL = config.baseURL.replace('http://', 'https://');
  }
  
  // Ensure the full URL is HTTPS
  const fullUrl = config.url ? `${config.baseURL}${config.url}` : config.baseURL;
  if (fullUrl && fullUrl.startsWith('http://') && 
      (window.location.protocol === 'https:' || fullUrl.includes('emergentagent.com'))) {
    const httpsUrl = fullUrl.replace('http://', 'https://');
    const baseUrl = config.baseURL || '';
    const relativeUrl = config.url || '';
    config.baseURL = httpsUrl.replace(relativeUrl, '');
  }
  
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.url || ''} (Base: ${config.baseURL})`);
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
    // Force HTTPS URL construction
    const baseURL = process.env.REACT_APP_BACKEND_URL || window.location.origin;
    const httpsBaseURL = baseURL.startsWith('http://') && 
      (window.location.protocol === 'https:' || baseURL.includes('emergentagent.com'))
      ? baseURL.replace('http://', 'https://')
      : baseURL;
    
    const fullURL = `${httpsBaseURL}/api/generate`;
    
    console.log('Direct HTTPS request to:', fullURL);
    
    const response = await axios.post(fullURL, {
      prompt,
      mode,
      sessionId
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    return response.data;
  },

  async getGenerationStatus(generationId) {
    // Force HTTPS URL construction
    const baseURL = process.env.REACT_APP_BACKEND_URL || window.location.origin;
    const httpsBaseURL = baseURL.startsWith('http://') && 
      (window.location.protocol === 'https:' || baseURL.includes('emergentagent.com'))
      ? baseURL.replace('http://', 'https://')
      : baseURL;
    
    const fullURL = `${httpsBaseURL}/api/generate/${generationId}`;
    
    const response = await axios.get(fullURL, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    return response.data;
  },

  async uploadImage(file, sessionId) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('sessionId', sessionId);

    // Force HTTPS URL construction
    const baseURL = process.env.REACT_APP_BACKEND_URL || window.location.origin;
    const httpsBaseURL = baseURL.startsWith('http://') && 
      (window.location.protocol === 'https:' || baseURL.includes('emergentagent.com'))
      ? baseURL.replace('http://', 'https://')
      : baseURL;
    
    const fullURL = `${httpsBaseURL}/api/generate/upload`;

    const response = await axios.post(fullURL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 30000
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