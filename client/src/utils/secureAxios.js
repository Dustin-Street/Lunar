import axios from 'axios';
import { API_BASE_URL } from './api';
import { sanitizeInput, generateSecureRandom } from './security';

// Create axios instance with security defaults
const secureAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  withCredentials: true, // Send cookies for refresh tokens
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Helps prevent CSRF
  },
});

// Request interceptor for security
secureAxios.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent replay attacks
    config.headers['X-Timestamp'] = Date.now().toString();

    // Add request ID for tracking
    config.headers['X-Request-ID'] = generateSecureRandom(8);

    // Sanitize any string data in the request
    if (config.data && typeof config.data === 'object') {
      config.data = sanitizeRequestData(config.data);
    }

    // Validate URLs to prevent SSRF
    if (config.url && !config.url.startsWith('/')) {
      if (!config.url.startsWith(API_BASE_URL)) {
        throw new Error('Invalid request URL');
      }
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for security
secureAxios.interceptors.response.use(
  (response) => {
    // Validate response structure
    if (response.data && typeof response.data === 'object') {
      // Check for unexpected script content
      const responseString = JSON.stringify(response.data);
      if (/<script/i.test(responseString)) {
        console.warn('Potentially malicious script content detected in response');
        throw new Error('Security violation: script content in response');
      }
    }

    return response;
  },
  (error) => {
    // Enhanced error handling
    if (error.response) {
      const { status, data } = error.response;

      // Handle authentication errors
      if (status === 401) {
        // Clear any sensitive data on auth failure
        if (typeof window !== 'undefined') {
          // Trigger logout if implemented
          window.dispatchEvent(new CustomEvent('auth-error'));
        }
      }

      // Sanitize error messages to prevent XSS
      if (data && data.message) {
        data.message = sanitizeInput(data.message);
      }

      // Log security-related errors
      if (status === 403 || status === 401) {
        console.warn('Authentication/Authorization error:', status);
      }
    } else if (error.request) {
      // Network error - could be MITM attempt
      console.error('Network error - possible security issue');
    }

    return Promise.reject(error);
  }
);

/**
 * Recursively sanitizes request data
 * @param {any} data - Data to sanitize
 * @returns {any} - Sanitized data
 */
function sanitizeRequestData(data) {
  if (typeof data === 'string') {
    return sanitizeInput(data);
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeRequestData(item));
  }

  if (data && typeof data === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      // Skip sensitive fields that shouldn't be logged/sanitized
      if (key.toLowerCase().includes('password') ||
          key.toLowerCase().includes('token') ||
          key.toLowerCase().includes('secret')) {
        sanitized[key] = value; // Keep as-is for sensitive data
      } else {
        sanitized[key] = sanitizeRequestData(value);
      }
    }
    return sanitized;
  }

  return data;
}

/**
 * Secure GET request
 * @param {string} url - Request URL
 * @param {object} config - Additional config
 * @returns {Promise} - Axios response
 */
export const secureGet = (url, config = {}) => {
  return secureAxios.get(url, config);
};

/**
 * Secure POST request
 * @param {string} url - Request URL
 * @param {any} data - Request data
 * @param {object} config - Additional config
 * @returns {Promise} - Axios response
 */
export const securePost = (url, data, config = {}) => {
  return secureAxios.post(url, data, config);
};

/**
 * Secure PUT request
 * @param {string} url - Request URL
 * @param {any} data - Request data
 * @param {object} config - Additional config
 * @returns {Promise} - Axios response
 */
export const securePut = (url, data, config = {}) => {
  return secureAxios.put(url, data, config);
};

/**
 * Secure PATCH request
 * @param {string} url - Request URL
 * @param {any} data - Request data
 * @param {object} config - Additional config
 * @returns {Promise} - Axios response
 */
export const securePatch = (url, data, config = {}) => {
  return secureAxios.patch(url, data, config);
};

/**
 * Secure DELETE request
 * @param {string} url - Request URL
 * @param {object} config - Additional config
 * @returns {Promise} - Axios response
 */
export const secureDelete = (url, config = {}) => {
  return secureAxios.delete(url, config);
};

export default secureAxios;