# Frontend Architecture

## Overview

The Learn By Doing frontend is built with React.js and follows a modern, component-based architecture with Redux for state management. This document outlines the structure, patterns, and key components of the frontend implementation.

## Technology Stack

- **Core Framework**: React.js
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router
- **API Communication**: Axios
- **Testing**: Jest and React Testing Library

## Directory Structure

```
frontend/
├── public/                # Static files
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Reusable UI components
│   │   ├── common/        # Shared components (Layout, Navbar, etc.)
│   │   └── problem/       # Problem-specific components
│   ├── pages/             # Page components
│   │   ├── Dashboard.js
│   │   ├── Login.js
│   │   ├── Profile.js
│   │   ├── Register.js
│   │   └── Problems.js
│   ├── services/          # API service calls
│   │   ├── authService.js
│   │   ├── problemsService.js
│   │   └── progressService.js
│   ├── store/             # Redux state management
│   │   ├── slices/        # Redux Toolkit slices
│   │   │   ├── authSlice.js
│   │   │   ├── problemsSlice.js
│   │   │   └── progressSlice.js
│   │   └── index.js       # Store configuration
│   ├── utils/             # Helper functions
│   ├── App.js             # Main app component
│   └── index.js           # Entry point
└── package.json           # Dependencies and scripts
```

## Key Components

### Layout Component

The `Layout` component provides a consistent structure for all pages, including:
- Navigation bar with responsive design
- User menu for authenticated users
- Consistent styling and spacing
- Container for page content

### Authentication Components

- **Login**: Form for user authentication
- **Register**: Form for new user registration
- **Profile**: Display user information and statistics

### Problem Components

- **ProblemList**: Displays available problems
- **ProblemDetail**: Shows problem description and steps
- **ProblemSolver**: Interactive component for solving problems
- **Hint**: Progressive disclosure of hints

## State Management

### Redux Store Structure

The Redux store is organized into slices:

```
{
  auth: {
    isAuthenticated: boolean,
    user: object | null,
    token: string | null,
    isLoading: boolean,
    error: string | null
  },
  problems: {
    items: array,
    currentProblem: object | null,
    isLoading: boolean,
    error: string | null
  },
  progress: {
    userProgress: array,
    isLoading: boolean,
    error: string | null
  }
}
```

### Auth Slice

The auth slice manages user authentication state:

- **State**: Authentication status, user data, token, loading state, errors
- **Actions**: Login, logout, register, fetch user data, clear errors
- **Selectors**: Get authentication status, user data

### Problems Slice

The problems slice manages problem data:

- **State**: Problem list, current problem, loading state, errors
- **Actions**: Fetch problems, select problem, submit solution
- **Selectors**: Get problems, current problem

### Progress Slice

The progress slice tracks user progress:

- **State**: User progress data, loading state, errors
- **Actions**: Fetch progress, update progress
- **Selectors**: Get progress data, completion statistics

## API Services

### Auth Service

Handles authentication-related API calls:

- `login(username, password)`: Authenticate user
- `register(email, username, password)`: Register new user
- `getCurrentUser()`: Fetch current user information
- `logout()`: Clear authentication data

### Problems Service

Manages problem-related API calls:

- `getProblems()`: Fetch all available problems
- `getProblem(id)`: Fetch a specific problem
- `submitSolution(id, solution)`: Submit a solution for validation

### Progress Service

Handles user progress-related API calls:

- `getUserProgress()`: Fetch user's progress data
- `updateProgress(problemId, status)`: Update progress for a problem

## Routing

The application uses React Router for navigation:

- **Public Routes**: Home, Login, Register
- **Protected Routes**: Dashboard, Profile, Problems
- **Route Guards**: Prevent unauthorized access to protected routes

## UI Components

The application uses Material-UI components for a consistent, responsive design:

- **AppBar**: Navigation header
- **Card**: Content containers
- **Typography**: Text styling
- **Button**: User interactions
- **TextField**: Form inputs
- **Dialog**: Modal interactions
- **Snackbar**: Notifications
- **CircularProgress**: Loading indicators

## Error Handling

The frontend implements comprehensive error handling:

- **API Errors**: Catch and display error messages from API calls
- **Form Validation**: Validate user input before submission
- **Authentication Errors**: Handle expired tokens and unauthorized access
- **Fallback UI**: Display user-friendly error messages

## Responsive Design

The application is designed to work across devices:

- **Breakpoints**: Responsive layout adjustments for different screen sizes
- **Flexible Grids**: Adapt content layout to available space
- **Touch-Friendly**: Optimized for both mouse and touch interactions

## Performance Optimization

- **Code Splitting**: Lazy loading of components
- **Memoization**: Prevent unnecessary re-renders
- **Efficient Redux Selectors**: Minimize state updates
- **Image Optimization**: Properly sized and compressed images

## Testing Strategy

The frontend testing strategy includes:

- **Component Tests**: Verify UI rendering and interactions
- **Redux Tests**: Validate state management logic
- **Service Tests**: Ensure correct API integration
- **Integration Tests**: Test component interactions

## Future Enhancements

- **Offline Support**: Service workers for offline functionality
- **Animation**: Enhanced transitions and interactions
- **Accessibility**: Improved screen reader support
- **Internationalization**: Multi-language support
