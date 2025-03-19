import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { 
  login, 
  register, 
  getCurrentUser, 
  logout 
} from '../../services/auth.service';

// Create axios mock
const mockAxios = new MockAdapter(axios);

describe('Authentication Service', () => {
  // Reset mocks before each test
  beforeEach(() => {
    mockAxios.reset();
    localStorage.clear();
  });

  describe('login', () => {
    test('should return user data and store token on successful login', async () => {
      // Mock API response
      const mockResponse = {
        access_token: 'test-token',
        token_type: 'bearer'
      };
      mockAxios.onPost('/api/v1/auth/token').reply(200, mockResponse);

      // Mock user info response
      const mockUserResponse = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        is_active: true
      };
      mockAxios.onGet('/api/v1/auth/me').reply(200, mockUserResponse);

      // Call login function
      const result = await login('testuser', 'password123');

      // Check results
      expect(result).toEqual(mockUserResponse);
      expect(localStorage.getItem('token')).toBe('test-token');
    });

    test('should throw error on failed login', async () => {
      // Mock API error response
      mockAxios.onPost('/api/v1/auth/token').reply(401, {
        detail: 'Incorrect username or password'
      });

      // Call login function and expect it to throw
      await expect(login('testuser', 'wrongpassword')).rejects.toThrow('Incorrect username or password');
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('register', () => {
    test('should register new user successfully', async () => {
      // Mock API response
      const mockResponse = {
        id: 1,
        username: 'newuser',
        email: 'new@example.com',
        is_active: true
      };
      mockAxios.onPost('/api/v1/auth/register').reply(201, mockResponse);

      // Call register function
      const result = await register('new@example.com', 'newuser', 'password123');

      // Check results
      expect(result).toEqual(mockResponse);
    });

    test('should throw error when username is taken', async () => {
      // Mock API error response
      mockAxios.onPost('/api/v1/auth/register').reply(400, {
        detail: 'Username already taken'
      });

      // Call register function and expect it to throw
      await expect(register('new@example.com', 'existinguser', 'password123'))
        .rejects.toThrow('Username already taken');
    });

    test('should throw error when email is already registered', async () => {
      // Mock API error response
      mockAxios.onPost('/api/v1/auth/register').reply(400, {
        detail: 'Email already registered'
      });

      // Call register function and expect it to throw
      await expect(register('existing@example.com', 'newuser', 'password123'))
        .rejects.toThrow('Email already registered');
    });
  });

  describe('getCurrentUser', () => {
    test('should return user data when token exists', async () => {
      // Set token in localStorage
      localStorage.setItem('token', 'test-token');

      // Mock API response
      const mockUserResponse = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        is_active: true
      };
      mockAxios.onGet('/api/v1/auth/me').reply(200, mockUserResponse);

      // Call getCurrentUser function
      const result = await getCurrentUser();

      // Check results
      expect(result).toEqual(mockUserResponse);
    });

    test('should return null when no token exists', async () => {
      // Call getCurrentUser function with no token
      const result = await getCurrentUser();

      // Check results
      expect(result).toBeNull();
    });

    test('should handle unauthorized error and clear token', async () => {
      // Set token in localStorage
      localStorage.setItem('token', 'invalid-token');

      // Mock API error response
      mockAxios.onGet('/api/v1/auth/me').reply(401, {
        detail: 'Could not validate credentials'
      });

      // Call getCurrentUser function
      const result = await getCurrentUser();

      // Check results
      expect(result).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('logout', () => {
    test('should clear token from localStorage', () => {
      // Set token in localStorage
      localStorage.setItem('token', 'test-token');

      // Call logout function
      logout();

      // Check token is cleared
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});
