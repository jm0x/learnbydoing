# Testing Infrastructure

## Overview

The Learn By Doing platform implements a comprehensive testing infrastructure to ensure code quality, functionality, and reliability. This document outlines the testing approach, tools, and practices used throughout the project.

## Testing Architecture

### Backend Testing (Python)

- **Framework**: Pytest
- **Test Types**:
  - Unit tests for individual functions and classes
  - Integration tests for API endpoints
  - Database tests with test fixtures
  - Authentication and security tests

### Frontend Testing (JavaScript)

- **Framework**: Jest with React Testing Library
- **Test Types**:
  - Component tests for UI elements
  - Redux store tests for state management
  - Service tests for API integration
  - Snapshot tests for UI consistency

### End-to-End Testing

- **Tools**: Custom bash scripts
- **Coverage**: Critical user flows and integration points

## Test Organization

### Backend Tests

```
backend/
└── tests/
    ├── api/              # API endpoint tests
    │   ├── test_auth.py
    │   ├── test_problems.py
    │   └── test_progress.py
    ├── services/         # Service layer tests
    │   ├── test_auth.py
    │   ├── test_problems.py
    │   └── test_progress.py
    ├── db/               # Database model tests
    │   ├── test_models.py
    │   └── test_crud.py
    ├── utils/            # Utility function tests
    │   └── test_security.py
    └── conftest.py       # Shared test fixtures
```

### Frontend Tests

```
frontend/
└── src/
    └── tests/
        ├── components/   # UI component tests
        │   ├── common/
        │   └── problem/
        ├── pages/        # Page component tests
        │   ├── Login.test.js
        │   ├── Profile.test.js
        │   └── Dashboard.test.js
        ├── services/     # API service tests
        │   ├── auth.service.test.js
        │   └── problems.service.test.js
        └── store/        # Redux store tests
            ├── authSlice.test.js
            └── problemsSlice.test.js
```

## Test Fixtures and Mocks

### Backend Fixtures

- **Database**: In-memory SQLite database for test isolation
- **Authentication**: Test tokens and users
- **Problem Data**: Sample problem definitions

### Frontend Mocks

- **API Responses**: Mock Axios for API calls
- **Redux Store**: Mock store for component testing
- **Router**: Mock navigation for route testing

## Running Tests

### Backend Tests

```bash
# Run all backend tests
cd backend
pytest

# Run specific test file
pytest tests/api/test_auth.py

# Run with coverage report
pytest --cov=app
```

### Frontend Tests

```bash
# Run all frontend tests
cd frontend
npm test

# Run specific test file
npm test -- src/tests/pages/Profile.test.js

# Run with coverage report
npm test -- --coverage
```

### All Tests

```bash
# Run all tests (backend and frontend)
./run_tests.sh
```

## Continuous Integration

The project uses GitHub Actions for continuous integration with the following workflow:

1. **Setup**: Install dependencies for backend and frontend
2. **Linting**: Run code quality checks
3. **Backend Tests**: Run pytest with coverage
4. **Frontend Tests**: Run Jest tests with coverage
5. **Report**: Generate and publish test reports

## Test-Driven Development

The project follows test-driven development practices:

1. Write tests that define expected behavior
2. Implement the minimum code to pass tests
3. Refactor while maintaining test coverage
4. Repeat for new features

## Recent Enhancements

### Authentication Testing

- Added comprehensive tests for user registration
- Added tests for login functionality
- Added tests for protected routes
- Added tests for token validation and expiration

### Profile Feature Testing

- Added tests for Profile component rendering
- Added tests for user data fetching
- Added tests for authentication state management
- Added tests for protected route redirection

## Best Practices

- **Isolation**: Each test runs in isolation without side effects
- **Deterministic**: Tests produce the same results on each run
- **Fast**: Tests run quickly to enable frequent execution
- **Readable**: Test names and assertions clearly describe behavior
- **Maintainable**: Tests are organized to match application structure
