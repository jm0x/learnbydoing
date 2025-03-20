import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Layout from '../../components/common/Layout';
import * as authSlice from '../../store/slices/authSlice';

// Create mock store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock the logout action
jest.mock('../../store/slices/authSlice', () => ({
  ...jest.requireActual('../../store/slices/authSlice'),
  logout: jest.fn(() => ({ type: 'auth/logout' }))
}));

describe('Layout Component', () => {
  let store;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });
  
  test('renders navigation links correctly when not authenticated', () => {
    // Setup mock store with not authenticated state
    store = mockStore({
      auth: {
        isAuthenticated: false,
        user: null
      }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Layout>
            <div>Test Content</div>
          </Layout>
        </BrowserRouter>
      </Provider>
    );
    
    // Check if correct links are displayed
    expect(screen.getByText('Learn By Doing')).toBeInTheDocument();
    expect(screen.getByText('Problems')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    
    // Check that authenticated-only links are not displayed
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });
  
  test('renders navigation links correctly when authenticated', () => {
    // Setup mock store with authenticated state
    store = mockStore({
      auth: {
        isAuthenticated: true,
        user: {
          id: 1,
          username: 'testuser'
        }
      }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Layout>
            <div>Test Content</div>
          </Layout>
        </BrowserRouter>
      </Provider>
    );
    
    // Check if correct links are displayed
    expect(screen.getByText('Learn By Doing')).toBeInTheDocument();
    expect(screen.getByText('Problems')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    
    // Check that non-authenticated links are not displayed
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });
  
  test('opens user menu when account icon is clicked', () => {
    // Setup mock store with authenticated state
    store = mockStore({
      auth: {
        isAuthenticated: true,
        user: {
          id: 1,
          username: 'testuser'
        }
      }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Layout>
            <div>Test Content</div>
          </Layout>
        </BrowserRouter>
      </Provider>
    );
    
    // Find and click the account icon button
    const accountButton = screen.getByLabelText('Account');
    fireEvent.click(accountButton);
    
    // Check if menu items are displayed
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
  
  test('navigates to profile page when profile menu item is clicked', () => {
    // Setup mock store with authenticated state
    store = mockStore({
      auth: {
        isAuthenticated: true,
        user: {
          id: 1,
          username: 'testuser'
        }
      }
    });
    
    // Mock the navigate function
    const navigateMock = jest.fn();
    require('react-router-dom').useNavigate.mockImplementation(() => navigateMock);
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Layout>
            <div>Test Content</div>
          </Layout>
        </BrowserRouter>
      </Provider>
    );
    
    // Find and click the account icon button
    const accountButton = screen.getByLabelText('Account');
    fireEvent.click(accountButton);
    
    // Find and click the profile menu item
    const profileMenuItem = screen.getByText('Profile');
    fireEvent.click(profileMenuItem);
    
    // Check if navigate was called with '/profile'
    expect(navigateMock).toHaveBeenCalledWith('/profile');
  });
  
  test('dispatches logout action when logout menu item is clicked', () => {
    // Setup mock store with authenticated state
    store = mockStore({
      auth: {
        isAuthenticated: true,
        user: {
          id: 1,
          username: 'testuser'
        }
      }
    });
    
    // Spy on store dispatch
    jest.spyOn(store, 'dispatch');
    
    // Mock the navigate function
    const navigateMock = jest.fn();
    require('react-router-dom').useNavigate.mockImplementation(() => navigateMock);
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Layout>
            <div>Test Content</div>
          </Layout>
        </BrowserRouter>
      </Provider>
    );
    
    // Find and click the account icon button
    const accountButton = screen.getByLabelText('Account');
    fireEvent.click(accountButton);
    
    // Find and click the logout menu item
    const logoutMenuItem = screen.getByText('Logout');
    fireEvent.click(logoutMenuItem);
    
    // Check if logout action was dispatched
    expect(store.dispatch).toHaveBeenCalledWith({ type: 'auth/logout' });
    
    // Check if navigate was called with '/login'
    expect(navigateMock).toHaveBeenCalledWith('/login');
  });
  
  test('renders children content', () => {
    // Setup mock store
    store = mockStore({
      auth: {
        isAuthenticated: false,
        user: null
      }
    });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Layout>
            <div data-testid="test-content">Test Content</div>
          </Layout>
        </BrowserRouter>
      </Provider>
    );
    
    // Check if children content is rendered
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
