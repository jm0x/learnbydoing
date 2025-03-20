# Backend Architecture

## Overview

The Learn By Doing backend is built with Python FastAPI and follows a modern, service-oriented architecture. This document outlines the structure, patterns, and key components of the backend implementation.

## Technology Stack

- **Framework**: FastAPI
- **Database ORM**: SQLAlchemy
- **Authentication**: JWT with Python-jose
- **Password Hashing**: Passlib with Bcrypt
- **Database**: PostgreSQL
- **API Documentation**: Swagger UI (via FastAPI)
- **Testing**: Pytest

## Directory Structure

```
backend/
├── app/
│   ├── api/                  # API routes
│   │   ├── v1/
│   │   │   ├── auth.py       # Authentication endpoints
│   │   │   ├── problems.py   # Problem endpoints
│   │   │   └── progress.py   # User progress endpoints
│   │   └── deps.py           # Dependency injection
│   ├── core/                 # Core application code
│   │   ├── config.py         # Configuration settings
│   │   └── security.py       # Security utilities
│   ├── db/                   # Database models and connections
│   │   ├── base.py           # Base model class
│   │   ├── session.py        # Database session
│   │   └── models/           # Database models
│   │       ├── user.py
│   │       ├── problem.py
│   │       └── progress.py
│   ├── services/             # Business logic
│   │   ├── auth.py           # Authentication service
│   │   ├── problems.py       # Problem management service
│   │   └── progress.py       # User progress service
│   ├── schemas/              # Pydantic models
│   │   ├── auth.py           # Auth-related schemas
│   │   ├── problem.py        # Problem-related schemas
│   │   └── progress.py       # Progress-related schemas
│   └── main.py               # FastAPI application entry point
├── tests/                    # Backend tests
│   ├── api/                  # API tests
│   ├── services/             # Service tests
│   └── conftest.py           # Test fixtures
└── requirements.txt          # Python dependencies
```

## API Endpoints

The backend API is organized into logical groups:

### Authentication Endpoints

- `POST /api/v1/auth/register`: Create a new user account
- `POST /api/v1/auth/token`: Login and obtain JWT token
- `GET /api/v1/auth/me`: Get current user information

### Problem Endpoints

- `GET /api/v1/problems`: List all problems
- `GET /api/v1/problems/{id}`: Get a specific problem
- `POST /api/v1/problems`: Create a new problem (admin only)
- `PUT /api/v1/problems/{id}`: Update a problem (admin only)
- `DELETE /api/v1/problems/{id}`: Delete a problem (admin only)

### Progress Endpoints

- `GET /api/v1/progress`: Get user's progress
- `POST /api/v1/progress`: Update user's progress for a problem
- `GET /api/v1/progress/stats`: Get user's statistics

## Database Models

### User Model

```python
class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
```

### Problem Model

```python
class Problem(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    difficulty = Column(String)
    category = Column(String, index=True)
    content = Column(JSON)  # Structured problem content
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

### Progress Model

```python
class Progress(Base):
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    problem_id = Column(Integer, ForeignKey("problems.id"))
    status = Column(String)  # "not_started", "in_progress", "completed"
    current_step = Column(Integer, default=0)
    attempts = Column(Integer, default=0)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

## Authentication System

The backend uses JWT (JSON Web Tokens) for authentication:

1. **User Registration**: Hash password and store user data
2. **User Login**: Verify credentials and issue JWT token
3. **Token Validation**: Validate token on protected endpoints
4. **Permission System**: Role-based access control

## Service Layer

The service layer contains the business logic of the application:

### Auth Service

- User registration and validation
- Password hashing and verification
- Token generation and validation

### Problems Service

- Problem CRUD operations
- Problem content validation
- Problem filtering and searching

### Progress Service

- Track user progress on problems
- Calculate statistics and achievements
- Update progress as users complete steps

## Dependency Injection

FastAPI's dependency injection system is used for:

- Database session management
- Current user retrieval
- Permission checking
- Common parameter validation

## Error Handling

The backend implements comprehensive error handling:

- **HTTP Exceptions**: Proper status codes and error messages
- **Validation Errors**: Detailed feedback on invalid input
- **Database Errors**: Graceful handling of database issues
- **Authentication Errors**: Clear messages for auth failures

## Configuration Management

The application uses environment variables for configuration:

- **Database Connection**: Connection string and credentials
- **JWT Settings**: Secret key and token expiration
- **CORS Settings**: Allowed origins and methods
- **Logging**: Log levels and output destinations

## API Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: Available at `/docs`
- **ReDoc**: Available at `/redoc`
- **OpenAPI Schema**: Available at `/openapi.json`

## Testing Strategy

The backend testing strategy includes:

- **Unit Tests**: Test individual functions and services
- **Integration Tests**: Test API endpoints
- **Database Tests**: Test database models and queries
- **Authentication Tests**: Test security mechanisms

## Performance Considerations

- **Database Indexing**: Optimized queries
- **Connection Pooling**: Efficient database connections
- **Async Endpoints**: Non-blocking I/O operations
- **Caching**: Frequently accessed data

## Security Features

- **Password Hashing**: Bcrypt for secure password storage
- **JWT Authentication**: Secure token-based auth
- **CORS Protection**: Controlled cross-origin access
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Prevent injection attacks

## Deployment Considerations

- **Docker Container**: Isolated environment
- **Health Checks**: Monitor application health
- **Environment Variables**: Configuration without code changes
- **Database Migrations**: Alembic for schema changes

## Port Configuration

The backend API runs on port 9090 (mapped to internal port 8000) to avoid conflicts with other services. This configuration is specified in:

- `docker-compose.yml`: Maps host port 9090 to container port 8000
- Test scripts: Use port 9090 for API requests
- Documentation: References port 9090 for API access
