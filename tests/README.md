# Learn By Doing - Testing Infrastructure

This document provides an overview of the testing infrastructure for the Learn By Doing project.

## Overview

The project includes a comprehensive testing infrastructure for both backend and frontend components:

- **Backend Unit Tests**: Tests for individual components, services, and utilities using pytest
- **API Integration Tests**: Tests for API endpoints using curl commands
- **Frontend Tests**: Tests for React components and services using Jest

## Directory Structure

```
learnbydoing/
├── backend/
│   └── tests/
│       ├── api/                 # API endpoint tests
│       │   └── test_auth.py     # Authentication API tests
│       ├── services/            # Service layer tests
│       │   └── test_auth_service.py
│       ├── utils/               # Utility function tests
│       │   └── test_security.py
│       ├── scripts/             # Test scripts
│       │   └── test_auth_api.sh # Curl-based API tests
│       ├── conftest.py          # Pytest configuration
│       └── run_tests.py         # Backend test runner
├── frontend/
│   └── src/
│       └── tests/
│           ├── components/      # React component tests
│           │   └── LoginForm.test.js
│           ├── pages/           # Page component tests
│           ├── services/        # Service tests
│           │   └── auth.service.test.js
│           └── run_tests.js     # Frontend test runner
└── run_tests.sh                 # Main test runner script
```

## Running Tests

### Running All Tests

To run all tests in the project:

```bash
./run_tests.sh
```

This script will:
1. Run backend unit tests
2. Run API integration tests (if the server is running)
3. Run frontend tests (if node_modules is installed)

### Running Backend Tests Only

To run only the backend unit tests:

```bash
cd backend
python tests/run_tests.py
```

### Running API Tests Only

To run only the API integration tests (requires the server to be running):

```bash
backend/tests/scripts/test_auth_api.sh
```

### Running Frontend Tests Only

To run only the frontend tests:

```bash
cd frontend
node src/tests/run_tests.js
```

## Test Requirements

### Backend Tests

- Python 3.8+
- pytest
- FastAPI
- SQLAlchemy
- python-jose
- passlib

Install the required packages:

```bash
cd backend
pip install -r requirements.txt
```

### API Tests

- bash
- curl

### Frontend Tests

- Node.js 14+
- npm
- Jest
- React Testing Library

Install the required packages:

```bash
cd frontend
npm install
```

## Writing New Tests

### Backend Tests

1. Create a new test file in the appropriate directory:
   - `backend/tests/api/` for API endpoint tests
   - `backend/tests/services/` for service layer tests
   - `backend/tests/utils/` for utility function tests

2. Use the pytest fixtures defined in `conftest.py` for database and client setup

3. Follow the existing test patterns:
   ```python
   def test_something(client):
       # Test code here
       assert result == expected
   ```

### Frontend Tests

1. Create a new test file in the appropriate directory:
   - `frontend/src/tests/components/` for React component tests
   - `frontend/src/tests/pages/` for page component tests
   - `frontend/src/tests/services/` for service tests

2. Follow the existing test patterns:
   ```javascript
   describe('Component Name', () => {
     test('should do something', () => {
       // Test code here
       expect(result).toBe(expected);
     });
   });
   ```

## Continuous Integration

In the future, this testing infrastructure will be integrated with a CI/CD pipeline to automatically run tests on code changes.
