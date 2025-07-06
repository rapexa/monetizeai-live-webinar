// Environment configuration
export const config = {
  // Force production API URL for now - change this back to conditional logic when ready
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://sianmarketing.com/live/api/api',
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
  FRONTEND_URL: import.meta.env.PROD 
    ? 'https://live.sianmarketing.com' 
    : 'http://localhost:8080',
};

// Debug logging to help troubleshoot
console.log('Environment Debug:', {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
  NODE_ENV: import.meta.env.NODE_ENV,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 
    (import.meta.env.PROD 
      ? 'https://sianmarketing.com/live/api/api' 
      : 'http://localhost:8081/api')
});

// API endpoints
export const API_ENDPOINTS = {
  REGISTER: '/register',
  WEBINAR: '/webinar',
  CHAT: '/chat',
} as const; 