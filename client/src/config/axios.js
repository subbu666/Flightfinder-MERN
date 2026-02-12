import axios from 'axios';
import API_URL from './api';

// Create axios instance with centralized configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - CRITICAL: Don't redirect on login errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // IMPORTANT: Only redirect to login if it's a token expiry issue
    // NOT for login route errors (401 on /login means wrong password, not expired token)
    
    const isLoginRoute = error.config?.url?.includes('/login');
    
    // Only auto-redirect if:
    // 1. It's a 401 error
    // 2. It's NOT the login route
    // 3. User has a token (meaning they were logged in)
    if (
      error.response?.status === 401 && 
      !isLoginRoute && 
      localStorage.getItem('token')
    ) {
      // Token expired or invalid - clear and redirect
      localStorage.clear();
      window.location.href = '/login';
    }
    
    // CRITICAL: Always return the error as-is so it can be handled properly
    // in the component/context
    return Promise.reject(error);
  }
);

export default api;