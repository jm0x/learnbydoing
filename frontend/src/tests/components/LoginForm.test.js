import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../../components/LoginForm';
import * as authService from '../../services/auth.service';

// Mock the auth service
jest.mock('../../services/auth.service');

describe('LoginForm Component', () => {
  // Setup before each test
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
  });

  test('renders login form correctly', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    // Check if form elements are rendered
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  test('handles input changes', async () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    // Get form elements
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    // Simulate user typing
    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(passwordInput, 'password123');

    // Check if inputs have the correct values
    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
  });

  test('submits form with correct data', async () => {
    // Mock successful login
    authService.login.mockResolvedValue({
      id: 1,
      username: 'testuser',
      email: 'test@example.com'
    });

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    // Get form elements
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    // Fill form
    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(passwordInput, 'password123');

    // Submit form
    fireEvent.click(submitButton);

    // Check if login function was called with correct arguments
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('testuser', 'password123');
    });
  });

  test('displays error message on login failure', async () => {
    // Mock login failure
    authService.login.mockRejectedValue(new Error('Incorrect username or password'));

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    // Get form elements
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    // Fill form
    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(passwordInput, 'wrongpassword');

    // Submit form
    fireEvent.click(submitButton);

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/incorrect username or password/i)).toBeInTheDocument();
    });
  });

  test('navigates to register page when register link is clicked', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    // Get register link
    const registerLink = screen.getByText(/register/i);

    // Click register link
    fireEvent.click(registerLink);

    // Check if navigation occurred (in a real test, we would check for route change)
    // For this example, we'll just check if the link has the correct href
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
  });
});
