/**
 * Frontend Security Utilities
 * Provides input sanitization, validation, and security helpers
 */

/**
 * Sanitizes text input to prevent XSS attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string safe for HTML rendering
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
export function validateEmail(email) {
  if (typeof email !== 'string') return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and errors array
 */
export function validatePassword(password) {
  const errors = [];

  if (typeof password !== 'string') {
    return { isValid: false, errors: ['Password must be a string'] };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (password.length > 128) {
    errors.push('Password must be less than 128 characters long');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check for common weak passwords
  const weakPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
  if (weakPasswords.includes(password.toLowerCase())) {
    errors.push('recommended to use a stronger password, that is a common weak password');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates username format
 * @param {string} username - Username to validate
 * @returns {object} - Validation result with isValid and errors array
 */
export function validateUsername(username) {
  const errors = [];

  if (typeof username !== 'string') {
    return { isValid: false, errors: ['Username must be a string'] };
  }

  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (username.length > 30) {
    errors.push('Username must be less than 30 characters long');
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, underscores, and hyphens');
  }

  // Check for reserved usernames
  const reservedUsernames = ['admin', 'administrator', 'root', 'system', 'api'];
  if (reservedUsernames.includes(username.toLowerCase())) {
    errors.push('This username is reserved and cannot be used');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generates a cryptographically secure random string
 * @param {number} length - Length of the random string
 * @returns {string} - Random string
 */
export function generateSecureRandom(length = 32) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Rate limiting helper for frontend actions
 */
export class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.attempts = [];
  }

  /**
   * Check if action is allowed
   * @returns {boolean} - True if action is allowed
   */
  isAllowed() {
    const now = Date.now();
    this.attempts = this.attempts.filter(time => now - time < this.windowMs);

    if (this.attempts.length >= this.maxAttempts) {
      return false;
    }

    this.attempts.push(now);
    return true;
  }

  /**
   * Get remaining time until reset
   * @returns {number} - Milliseconds until reset
   */
  getTimeUntilReset() {
    if (this.attempts.length === 0) return 0;

    const now = Date.now();
    const oldestAttempt = Math.min(...this.attempts);
    return Math.max(0, this.windowMs - (now - oldestAttempt));
  }
}

/**
 * Secure local storage wrapper that prevents XSS
 */
export class SecureStorage {
  static setItem(key, value) {
    try {
      const sanitizedKey = sanitizeInput(key);
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(sanitizedKey, stringValue);
    } catch (error) {
      console.error('SecureStorage setItem error:', error);
    }
  }

  static getItem(key) {
    try {
      const sanitizedKey = sanitizeInput(key);
      const value = localStorage.getItem(sanitizedKey);
      if (value === null) return null;

      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error('SecureStorage getItem error:', error);
      return null;
    }
  }

  static removeItem(key) {
    try {
      const sanitizedKey = sanitizeInput(key);
      localStorage.removeItem(sanitizedKey);
    } catch (error) {
      console.error('SecureStorage removeItem error:', error);
    }
  }

  static clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('SecureStorage clear error:', error);
    }
  }
}

/**
 * Prevents clickjacking attacks by checking if page is in an iframe
 */
export function preventClickjacking() {
  if (window.self !== window.top) {
    // Page is in an iframe, redirect to prevent clickjacking
    window.top.location.href = window.self.location.href;
  }
}

/**
 * Detects potential XSS attempts in URLs
 * @param {string} url - URL to check
 * @returns {boolean} - True if URL appears safe
 */
export function isSafeUrl(url) {
  if (typeof url !== 'string') return false;

  const dangerousPatterns = [
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /on\w+\s*=/i,
    /<script/i,
    /<\/script>/i
  ];

  return !dangerousPatterns.some(pattern => pattern.test(url));
}