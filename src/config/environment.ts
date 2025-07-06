// Environment configuration
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api',
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
};

// API endpoints
export const API_ENDPOINTS = {
  REGISTER: '/register',
  WEBINAR: '/webinar',
  CHAT: '/chat',
} as const; 