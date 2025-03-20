import { configureStore } from '@reduxjs/toolkit';
import authReducer, { 
  login, 
  logout, 
  register, 
  fetchCurrentUser,
  clearError 
} from '../../store/slices/authSlice';
import authService from '../../services/authService';

// Mock the auth service
jest.mock('../../services/authService', () => ({
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  getCurrentUser: jest.fn()
}));

describe('Auth Slice', () => {
  let store;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create a new store for each test
    store = configureStore({
      reducer: {
        auth: authReducer
      }
    });
  });
  
  describe('login action', () => {
    test('should set isAuthenticated to true on successful login', async () => {
      // Mock successful login
      authService.login.mockResolvedValue({
        access_token: 'test-token',
        token_type: 'bearer'
      });
      
      // Dispatch login action
      await store.dispatch(login({ username: 'testuser', password: 'password123' }));
      
      // Check state
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.token).toBe('test-token');
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });
    
    test('should set error on failed login', async () => {
      // Mock failed login
      const errorMessage = 'Incorrect username or password';
      authService.login.mockRejectedValue({
        response: { data: { detail: errorMessage } }
      });
      
      // Dispatch login action
      await store.dispatch(login({ username: 'testuser', password: 'wrongpassword' }));
      
      // Check state
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.token).toBe(null);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
  
  describe('fetchCurrentUser action', () => {
    test('should set user data on successful fetch', async () => {
      // Mock user data
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        is_active: true
      };
      
      // Mock successful fetch
      authService.getCurrentUser.mockResolvedValue(mockUser);
      
      // Dispatch fetchCurrentUser action
      await store.dispatch(fetchCurrentUser());
      
      // Check state
      const state = store.getState().auth;
      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });
    
    test('should set error on failed fetch', async () => {
      // Mock failed fetch
      const errorMessage = 'Failed to fetch user data';
      authService.getCurrentUser.mockRejectedValue({
        response: { data: { detail: errorMessage } }
      });
      
      // Dispatch fetchCurrentUser action
      await store.dispatch(fetchCurrentUser());
      
      // Check state
      const state = store.getState().auth;
      expect(state.user).toBe(null);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
  
  describe('logout action', () => {
    test('should clear authentication state', () => {
      // Set initial state
      store = configureStore({
        reducer: {
          auth: authReducer
        },
        preloadedState: {
          auth: {
            user: { id: 1, username: 'testuser' },
            token: 'test-token',
            isAuthenticated: true,
            isLoading: false,
            error: null
          }
        }
      });
      
      // Dispatch logout action
      store.dispatch(logout());
      
      // Check state
      const state = store.getState().auth;
      expect(state.user).toBe(null);
      expect(state.token).toBe(null);
      expect(state.isAuthenticated).toBe(false);
    });
  });
  
  describe('clearError action', () => {
    test('should clear error state', () => {
      // Set initial state with error
      store = configureStore({
        reducer: {
          auth: authReducer
        },
        preloadedState: {
          auth: {
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Some error'
          }
        }
      });
      
      // Dispatch clearError action
      store.dispatch(clearError());
      
      // Check state
      const state = store.getState().auth;
      expect(state.error).toBe(null);
    });
  });
});
