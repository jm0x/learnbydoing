import axios from 'axios';

// Use environment variable or default value for API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const PROGRESS_URL = `${API_URL}/api/v1/progress`;

// Create axios instance with auth header
const axiosInstance = axios.create();

// Add auth token to requests if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Get current user's progress for all problems
 * @returns {Promise} Promise with user progress data
 */
const getUserProgress = async () => {
  try {
    const response = await axiosInstance.get(PROGRESS_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching user progress:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Update progress for a specific problem
 * @param {number|string} problemId - ID of the problem
 * @param {Object} data - Progress data to update
 * @returns {Promise} Promise with updated progress data
 */
const updateProgress = async (problemId, data) => {
  try {
    const response = await axiosInstance.put(`${PROGRESS_URL}/${problemId}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating progress for problem ${problemId}:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get progress for a specific problem
 * @param {number|string} problemId - ID of the problem
 * @returns {Promise} Promise with problem progress data
 */
const getProblemProgress = async (problemId) => {
  try {
    const response = await axiosInstance.get(`${PROGRESS_URL}/${problemId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching progress for problem ${problemId}:`, error.response?.data || error.message);
    throw error;
  }
};

const progressService = {
  getUserProgress,
  updateProgress,
  getProblemProgress
};

export default progressService;
