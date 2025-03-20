import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Profile from '../../pages/Profile';
import * as authSlice from '../../store/slices/authSlice';

// Create mock store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock the fetchCurrentUser action
jest.mock('../../store/slices/authSlice', () => ({
  ...jest.requireActual('../../store/slices/authSlice'),
  fetchCurrentUser: jest.fn(() => ({ type: 'auth/fetchCurrentUser' }))
}));

describe('Profile Component', () => {
  let store;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });
  
  test('redirects to login if not authenticated', () => {
    // Setup mock store with not authenticated state
    store = mockStore({
      auth: {
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null
      },
      progress: {
        userProgress: []
      }
    });
    
    // Mock the navigate function
    const navigateMock = jest.fn();
    require('react-router-dom').useNavigate.mockImplementation(() => navigateMock);
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </Provider>
    );
    
    // Check if navigate was called with '/login'
    expect(navigateMock).toHaveBeenCalledWith('/login');
  });
  
  test('dispatches fetchCurrentUser if authenticated but no user data', () => {
    // Setup mock store with authenticated state but no user
    store = mockStore({
      auth: {
        isAuthenticated: true,
        user: null,
        isLoading: false,
        error: null
      },
      progress: {
        userProgress: []
      }
    });
    
    // Spy on store dispatch
    jest.spyOn(store, 'dispatch');
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </Provider>
    );
    
    // Check if fetchCurrentUser action was dispatched
    expect(store.dispatch).toHaveBeenCalledWith({ type: 'auth/fetchCurrentUser' });
  });
  
  test('displays loading state when isLoading is true', () => {
    // Setup mock store with loading state
    store = mockStore({
      auth: {
        isAuthenticated: true,
        user: null,
        isLoading: true,
        error: null
      },
      progress: {
        userProgress: []
      }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </Provider>
    );
    
    // Check if loading indicator is displayed
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  
  test('displays error message when there is an error', () => {
    // Setup mock store with error state
    const errorMessage = 'Failed to load user data';
    store = mockStore({
      auth: {
        isAuthenticated: true,
        user: null,
        isLoading: false,
        error: errorMessage
      },
      progress: {
        userProgress: []
      }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </Provider>
    );
    
    // Check if error message is displayed
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
  
  test('displays user information when user data is loaded', () => {
    // Mock user data
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      is_active: true
    };
    
    // Mock progress data
    const mockProgress = [
      { problem_id: 1, completed: true, current_step: 5 },
      { problem_id: 2, completed: false, current_step: 3 }
    ];
    
    // Setup mock store with user data
    store = mockStore({
      auth: {
        isAuthenticated: true,
        user: mockUser,
        isLoading: false,
        error: null
      },
      progress: {
        userProgress: mockProgress
      }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </Provider>
    );
    
    // Check if user information is displayed
    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByText('Active Account')).toBeInTheDocument();
    
    // Check if statistics are displayed
    expect(screen.getByText('1')).toBeInTheDocument(); // Completed problems
    expect(screen.getByText('1')).toBeInTheDocument(); // In progress problems
    expect(screen.getByText('2')).toBeInTheDocument(); // Total attempted
  });
});
