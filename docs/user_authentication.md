# User Authentication and Profile Features

## Overview

The Learn By Doing platform implements a comprehensive user authentication system with profile management capabilities. This document outlines the implementation details, components, and usage of these features.

## Features

### Authentication

- **User Registration**: New users can create accounts with email, username, and password
- **User Login**: Secure authentication using JWT tokens
- **Password Security**: Passwords are hashed using bcrypt
- **Token Management**: JWT tokens are stored in localStorage with proper expiration handling

### User Profile

- **Profile Page**: Displays user information and statistics
- **User Information**: Shows username, email, and account status
- **User Statistics**: Displays completed and in-progress problems
- **Protected Routes**: Ensures only authenticated users can access certain pages

## Implementation

### Backend (FastAPI)

#### Authentication Endpoints

- `POST /api/v1/auth/register`: Create a new user account
- `POST /api/v1/auth/token`: Login and obtain JWT token
- `GET /api/v1/auth/me`: Get current user information

#### User Model

The User model includes:
- `id`: Unique identifier
- `username`: Unique username
- `email`: Unique email address
- `hashed_password`: Securely stored password
- `is_active`: Account status

### Frontend (React)

#### Authentication Components

- **Login Page**: Form for user authentication
- **Register Page**: Form for new user registration
- **Profile Page**: Display user information and statistics

#### Redux State Management

The authentication state is managed through Redux with the following:

- **Auth Slice**: Manages authentication state including:
  - `isAuthenticated`: Boolean indicating authentication status
  - `user`: Object containing user information
  - `token`: JWT token
  - `isLoading`: Loading state for async operations
  - `error`: Error state for failed operations

- **Auth Actions**:
  - `login`: Authenticate user and store token
  - `register`: Create new user account
  - `logout`: Clear authentication state
  - `fetchCurrentUser`: Retrieve current user information

#### Authentication Service

The `authService.js` file provides the following functions:
- `login(username, password)`: Authenticate user
- `register(email, username, password)`: Register new user
- `getCurrentUser()`: Fetch current user information
- `logout()`: Clear authentication data

## Testing

### Backend Tests

- Unit tests for authentication endpoints
- Tests for token validation
- Tests for user registration validation

### Frontend Tests

- Component tests for Login, Register, and Profile pages
- Service tests for authentication API calls
- Redux tests for auth slice actions and reducers

## Security Considerations

- JWT tokens are stored in localStorage
- Protected routes redirect unauthenticated users to login
- API endpoints validate token on each request
- Passwords are securely hashed
- Error messages are generic to prevent information leakage

## Usage

### User Registration

1. Navigate to the Register page
2. Enter email, username, and password
3. Submit the form
4. On successful registration, user is redirected to login

### User Login

1. Navigate to the Login page
2. Enter username and password
3. Submit the form
4. On successful login, user is redirected to dashboard

### Accessing User Profile

1. Login to the application
2. Click on the user icon in the navigation bar
3. Select "Profile" from the dropdown menu
4. View user information and statistics

## Future Enhancements

- Password reset functionality
- Email verification
- Two-factor authentication
- OAuth integration for social login
- Enhanced profile customization options
