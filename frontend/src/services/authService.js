import axios from 'axios';

// Use environment variable or default value for API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:9090';
const AUTH_URL = `${API_URL}/api/v1/auth`;

/**
 * Login user and get JWT token
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise} Promise with token data
 */
const login = async (username, password) => {
  try {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await axios.post(`${AUTH_URL}/token`, formData);
    
    // Store token in localStorage
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get current user information
 * @returns {Promise} Promise with user data
 */
const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await axios.get(`${AUTH_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Get user error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Register new user
 * @param {string} username - User's username
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} Promise with user data
 */
const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${AUTH_URL}/register`, {
      username,
      email,
      password
    });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Logout user by removing token
 */
const logout = () => {
  localStorage.removeItem('token');
};

const authService = {
  login,
  register,
  logout,
  getCurrentUser
};

export default authService;
