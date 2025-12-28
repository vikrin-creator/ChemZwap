import axios from 'axios';

// Base API configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default config
// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,  // Using the API_URL from environment variables or defaulting to localhost:8000
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,  // 30 seconds timeout
});
// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // For FormData, let the browser set the Content-Type with the correct boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized, redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
      return Promise.reject(new Error('Session expired. Please log in again.'));
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Unable to connect to the server. Please check your internet connection.'));
    }

    // Handle server errors
    const { status, data } = error.response;
    let errorMessage = 'An unexpected error occurred';

    if (status >= 500) {
      errorMessage = 'Server error. Please try again later.';
    } else if (data?.message) {
      errorMessage = data.message;
    }

    console.error(`API Error [${status}]:`, data || error.message);
    return Promise.reject(new Error(errorMessage));
  }
);

// Helper function to handle file uploads
const handleFileUpload = async (url, formData, method = 'post', onProgress) => {
  try {
    // Ensure we have FormData
    if (!formData) {
      throw new Error('No form data provided');
    }

    let uploadData = new FormData();

    // Convert plain object to FormData if needed
    if (!(formData instanceof FormData)) {
      if (typeof formData !== 'object' || formData === null) {
        throw new Error('Form data must be an object or FormData instance');
      }

      Object.entries(formData).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        if (Array.isArray(value)) {
          value.forEach(item => {
            if (item !== null && item !== undefined) {
              if (item instanceof File || item instanceof Blob) {
                uploadData.append(key, item);
              } else if (typeof item === 'object') {
                uploadData.append(key, JSON.stringify(item));
              } else {
                uploadData.append(key, item);
              }
            }
          });
        } else if (value instanceof File || value instanceof Blob) {
          uploadData.append(key, value);
        } else if (typeof value === 'object') {
          uploadData.append(key, JSON.stringify(value));
        } else {
          uploadData.append(key, value);
        }
      });
    } else {
      // If it's already FormData, use it directly
      uploadData = formData;
    }

    // Debug log
    if (process.env.NODE_ENV === 'development') {
      console.group('File Upload Debug');
      console.log('Upload URL:', url);
      console.log('Method:', method.toUpperCase());
      console.log('Headers:', {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('adminToken') ? '***' : 'Not Set'}`
      });

      // Log form data entries safely
      const entries = {};
      for (let [key, value] of uploadData.entries()) {
        if (value instanceof File || value instanceof Blob) {
          entries[key] = `File: ${value.name || 'blob'} (${(value.size / 1024).toFixed(2)} KB)`;
        } else {
          try {
            entries[key] = typeof value === 'string' ? value : JSON.stringify(value);
          } catch (e) {
            entries[key] = '[Non-serializable value]';
          }
        }
      }
      console.log('Form Data:', entries);
      console.groupEnd();
    }

    const config = {
      method,
      url,
      data: uploadData,
      headers: {},
      onUploadProgress: (progressEvent) => {
        if (progressEvent.lengthComputable && progressEvent.total > 0) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${percentCompleted}%`);
          if (typeof onProgress === 'function') {
            onProgress(percentCompleted);
          }
        } else if (progressEvent.loaded) {
          console.log(`Uploaded: ${progressEvent.loaded} bytes`);
          if (typeof onProgress === 'function') {
            onProgress(0); // Indeterminate progress
          }
        }
      },
      validateStatus: function (status) {
        return status >= 200 && status < 400; // Resolve only if status code is 2xx or 3xx
      }
    };

    const response = await api(config);
    return response;

  } catch (error) {
    console.error('File upload error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      response: error.response?.data || 'No response data',
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data instanceof FormData ? '[FormData]' : error.config?.data
      }
    });

    let errorMessage = 'Failed to upload file';

    if (error.response) {
      // Server responded with a status code outside 2xx
      const { status, data } = error.response;

      if (status === 401) {
        errorMessage = 'Session expired. Please log in again.';
      } else if (status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (data?.message) {
        errorMessage = data.message;
      } else if (data?.error) {
        errorMessage = data.error;
      } else {
        errorMessage = `Request failed with status ${status}`;
      }
    } else if (error.request) {
      // Request was made but no response was received
      errorMessage = 'No response from server. Please check your connection.';
    } else if (error.message) {
      // Something happened in setting up the request
      errorMessage = error.message;
    }

    const uploadError = new Error(errorMessage);
    uploadError.originalError = error;
    uploadError.isNetworkError = !error.response && error.request;
    uploadError.isServerError = error.response?.status >= 500;

    throw uploadError;
  }
};

const adminApi = {
  // Auth
  // Auth endpoints
  auth: {
    // Login with credentials (email/password)
    login: (credentials) => api.post('/api/auth/login', credentials),

    // Request password reset email
    forgotPassword: (data) => api.post('/api/auth/forgot-password', data),

    // Reset password
    resetPassword: (data) =>
      api.post('/api/auth/reset-password', data),

    // Get current user profile
    getProfile: async () => {
      try {
        const response = await api.get('/api/auth/me'); // Try with /me first
        return response;
      } catch (error) {
        if (error.response?.status === 404) {
          // If /me fails, try the base /auth endpoint
          try {
            const response = await api.get('/api/auth');
            return response;
          } catch (e) {
            throw e; // Re-throw if both attempts fail
          }
        }
        throw error;
      }
    },

    // Logout (optional - can be handled client-side by removing token)
    logout: () => {
      localStorage.removeItem('adminToken');
      return Promise.resolve();
    }
  },
  // Users
  users: {
    getAll: (params) => api.get('/api/users', { params }),
    getById: (id) => api.get(`/api/users/${id}`),
    create: (userData) => api.post('/api/users', userData),
    update: (id, userData) => api.put(`/api/users/${id}`, userData),
    updateStatus: (id, isActive) =>
      api.put(`/api/users/${id}/status`, { isActive }),
    delete: (id) => api.delete(`/api/users/${id}`)
  },

  // Products
  products: {
    getAll: () => api.get('/api/products'),
    getById: (id) => api.get(`/api/products/${id}`),
    create: (data) => api.post('/api/products', data),
    update: (id, data) => api.put(`/api/products/${id}`, data),
    delete: (id) => api.delete(`/api/products/${id}`)
  },

  // Orders
  orders: {
    getAll: (params) => api.get('/api/orders', { params }),
    getById: (id) => api.get(`/api/orders/${id}`),
    updateStatus: (id, status) => api.put(`/api/orders/${id}/status`, { status }),
  },

  // Presets
  presets: {
    getAll: (params = {}) => api.get('/api/presets', { params }),
    getById: (id) => api.get(`/api/presets/${id}`),
    create: (formData, onProgress) => handleFileUpload('/api/presets', formData, 'post', onProgress),
    update: (id, formData, onProgress) => handleFileUpload(`/api/presets/${id}`, formData, 'put', onProgress),
    delete: (id) => api.delete(`/api/presets/${id}`),
    uploadToDrive: async (presetId) => {
      try {
        if (!presetId) throw new Error('Preset ID is required');
        const response = await api.post(`/api/presets/${presetId}/upload-to-drive`);
        if (!response.data) throw new Error('No data received from server');
        return { success: true, data: response.data, message: 'Successfully uploaded to Google Drive' };
      } catch (error) {
        console.error('Error uploading to Google Drive:', error);
        return { success: false, error: error.message, message: 'Failed to upload to Google Drive' };
      }
    },
    testDriveLink: async (url) => {
      try {
        const response = await api.post('/api/presets/test-drive-link', { url });
        return response.data;
      } catch (error) {
        console.error('Error testing Drive link:', error);
        throw error;
      }
    }
  },

  // Dashboard
  dashboard: {
    getStats: async () => {
      try {
        const response = await api.get('/api/dashboard/stats');
        return response.data;
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
      }
    },
  },

  // Enquiries
  enquiries: {
    getAll: () => api.get('/api/enquiries'),
    updateStatus: (id, status) => api.put(`/api/enquiries/${id}/status`, { status }),
    delete: (id) => api.delete(`/api/enquiries/${id}`)
  },

  // Categories
  categories: {
    getAll: () => api.get('/api/categories'),
    getById: (id) => api.get(`/api/categories/${id}`),
    create: (data) => api.post('/api/categories', data),
    update: (id, data) => api.put(`/api/categories/${id}`, data),
    delete: (id) => api.delete(`/api/categories/${id}`)
  },
};

export default adminApi;