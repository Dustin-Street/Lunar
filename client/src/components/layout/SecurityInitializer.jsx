import { useEffect } from 'react';
import { preventClickjacking, SecureStorage } from '../utils/security';

/**
 * SecurityInitializer component that runs security checks on app startup
 * This component performs security validations and cleanup when the app loads
 */
export default function SecurityInitializer() {
  useEffect(() => {
    // Prevent clickjacking attacks
    preventClickjacking();

    // Clean up any sensitive data that might be in insecure storage
    try {
      // Check for any tokens in localStorage and warn/remove them
      const localStorageKeys = Object.keys(localStorage);
      const sensitiveKeys = localStorageKeys.filter(key =>
        key.toLowerCase().includes('token') ||
        key.toLowerCase().includes('auth') ||
        key.toLowerCase().includes('jwt')
      );

      if (sensitiveKeys.length > 0) {
        console.warn('Sensitive authentication data found in localStorage. Removing for security.');
        sensitiveKeys.forEach(key => {
          localStorage.removeItem(key);
        });
      }
    } catch (error) {
      console.error('Error during security initialization:', error);
    }

    // Set up global error handlers for unhandled errors
    const handleUnhandledError = (event) => {
      console.error('Unhandled error:', event.error);
      // Don't expose sensitive information in production
      if (import.meta.env.MODE === 'production') {
        event.preventDefault();
      }
    };

    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      // Don't expose sensitive information in production
      if (import.meta.env.MODE === 'production') {
        event.preventDefault();
      }
    };

    window.addEventListener('error', handleUnhandledError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup function
    return () => {
      window.removeEventListener('error', handleUnhandledError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // This component doesn't render anything
  return null;
}