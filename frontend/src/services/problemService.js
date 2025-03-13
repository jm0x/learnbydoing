import axios from 'axios';

// Use environment variable or default value for API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const PROBLEMS_URL = `${API_URL}/api/v1/problems`;

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
 * Get all problems
 * @param {number} skip - Number of items to skip for pagination
 * @param {number} limit - Max number of items to return
 * @returns {Promise} Promise with problems data
 */
const getProblems = async (skip = 0, limit = 100) => {
  try {
    const response = await axiosInstance.get(PROBLEMS_URL, {
      params: { skip, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching problems:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get problem by ID
 * @param {number|string} id - Problem ID
 * @returns {Promise} Promise with problem data
 */
const getProblemById = async (id) => {
  try {
    const response = await axiosInstance.get(`${PROBLEMS_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching problem ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Create a new problem
 * @param {Object} problemData - Problem data
 * @returns {Promise} Promise with created problem data
 */
const createProblem = async (problemData) => {
  try {
    const response = await axiosInstance.post(PROBLEMS_URL, problemData);
    return response.data;
  } catch (error) {
    console.error('Error creating problem:', error.response?.data || error.message);
    throw error;
  }
};

const problemService = {
  getProblems,
  getProblemById,
  createProblem
};

export default problemService;
