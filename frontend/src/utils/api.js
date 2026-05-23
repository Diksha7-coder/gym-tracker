import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios Request Interceptor: Automatically attach JWT token to headers if it exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aura_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Log in an existing user with email and password
 */
export const loginUser = async (email, password) => {
  try {
    const response = await API.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('API Login Error:', error);
    throw error.response?.data || new Error('Connection failed. Verify your server is online.');
  }
};

/**
 * Register a new user account and compile their AI plan at the same time
 */
export const registerUser = async (userData) => {
  try {
    const response = await API.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('API Register Error:', error);
    throw error.response?.data || new Error('Registration failed. Check parameters and email uniqueness.');
  }
};

/**
 * Recover the authenticated profile using the JWT session token in headers
 */
export const getMe = async () => {
  try {
    const response = await API.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('API Fetch Current User Error:', error);
    throw error.response?.data || new Error('Failed to recover your active session.');
  }
};

/**
 * Regenerate a new AI plan inside an active logged-in session
 */
export const regenerateUserPlan = async (userData) => {
  try {
    const response = await API.post('/auth/regenerate', userData);
    return response.data;
  } catch (error) {
    console.error('API Regenerate Plan Error:', error);
    throw error.response?.data || new Error('Failed to update your fitness and diet plan.');
  }
};

export const generatePlan = async (formData) => {
  try {
    const response = await API.post('/fitness/generate', formData);
    return response.data;
  } catch (error) {
    console.error('API Generate Plan Error:', error);
    throw error.response?.data || new Error('Failed to generate plan.');
  }
};

export default API;
