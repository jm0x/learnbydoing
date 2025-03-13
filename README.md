# Learn By Doing

An interactive web application for problem-solving and guided learning, focusing on step-by-step approaches to help users truly understand concepts through practice.

## Architecture

This project follows a modern three-tier architecture with clean code principles:

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  React Frontend │◄────►│  Python Backend │◄────►│    Database     │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

### Frontend (React.js)
- Single Page Application (SPA) with React Router
- State management with Redux Toolkit
- Modern UI with Material-UI
- Interactive problem visualization and step-by-step guided learning
- Comprehensive error handling and consistent API service layer
- Environment variable configuration for flexible deployment

### Backend (Python FastAPI)
- High-performance asynchronous API
- Core services:
  - Authentication service
  - Problem management service
  - User progress service
  - Hint/Solution validation service
- Database connection pooling with health checks
- Comprehensive API documentation
- Proper environment variable management
- Organized dependencies with clear categorization

### Database (PostgreSQL)
- Relational database for structured data
- Strong support for complex queries
- JSON support for flexible problem structure storage
- Connection pooling for optimized performance

## Development Best Practices

This project follows several best practices for maintainable, secure, and efficient code:

### Code Organization
- Consistent naming conventions across the stack
- JSDoc and Python docstrings for all functions
- Separation of concerns with clear module boundaries
- DRY (Don't Repeat Yourself) principles

### Error Handling
- Comprehensive try/catch blocks in all API services
- Descriptive error messages and logging
- Graceful error recovery
- Frontend error state management

### Security
- Non-root users in Docker containers
- Proper permission management
- Secure password hashing with Bcrypt
- JWT token-based authentication
- CORS configuration for API security

### DevOps
- Docker health checks for all containers
- Container networking isolation
- Optimized Docker builds
- Environment variable configuration
- Connection pooling and database optimization

### Testing
- Pytest for backend unit and integration tests
- HTTPX for API testing
- Comprehensive test coverage

## Project Structure

```
learn-by-doing/
├── .github/                      # GitHub workflows for CI/CD
├── backend/                      # Python FastAPI Backend
│   ├── app/
│   │   ├── api/                  # API routes
│   │   ├── core/                 # Core application code
│   │   ├── db/                   # Database models and connections
│   │   ├── services/             # Business logic
│   │   ├── schemas/              # Pydantic models
│   │   └── main.py               # FastAPI application entry point
│   ├── tests/                    # Backend tests
│   └── requirements.txt          # Python dependencies (categorized)
├── frontend/                     # React Frontend
│   ├── public/                   # Static files
│   ├── src/
│   │   ├── assets/               # Images, fonts, etc.
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Page components
│   │   ├── services/             # API service calls
│   │   ├── store/                # Redux state management
│   │   ├── utils/                # Helper functions
│   │   ├── App.js                # Main app component
│   │   └── index.js              # Entry point
│   └── package.json              # Frontend dependencies
├── database/                     # Database migrations and scripts
│   ├── migrations/               # Alembic migrations
│   └── init.sql                  # Initial database setup
├── docker/                       # Docker configuration
│   ├── frontend.Dockerfile
│   ├── backend.Dockerfile
│   └── db.Dockerfile
├── docker-compose.yml            # Docker Compose for local development
└── README.md                     # Project documentation
```

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (for local frontend development)
- Python 3.11+ (for local backend development)

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/learn-by-doing.git
   cd learn-by-doing
   ```

2. Start the application using Docker Compose:
   ```bash
   docker-compose up
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Environment Variables

The application uses environment variables for configuration:

#### Backend
- `POSTGRES_SERVER`: Database hostname (default: "db")
- `POSTGRES_USER`: Database username (default: "postgres") 
- `POSTGRES_PASSWORD`: Database password (default: "postgres")
- `POSTGRES_DB`: Database name (default: "learnbydoing")
- `SECRET_KEY`: JWT secret key (default: "supersecretkey")

#### Frontend
- `REACT_APP_API_URL`: Backend API URL (default: "http://localhost:8000")

### Local Development

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

### Python Dependencies

The backend uses the following key dependencies (see `backend/requirements.txt` for the complete list):

- **API Framework**: FastAPI, Uvicorn
- **Database**: SQLAlchemy, Psycopg2, Alembic
- **Data Validation**: Pydantic, Email-validator
- **Authentication**: Python-jose, Passlib, Bcrypt
- **Testing**: Pytest, HTTPX
- **Utilities**: Python-dotenv, Tenacity

## Features

- Interactive problem-solving with step-by-step guidance
- Progress tracking and personalized dashboard
- Hint system with progressive disclosure
- Solution validation
- User authentication and profile management

## Data Model

The core data model includes:

- **Problems**: Structured learning content with steps, hints, and solutions
- **Users**: User profiles and authentication information
- **Progress**: Tracking user advancement through problems

## Development Workflow

1. Start with the minimal viable product (MVP)
2. Implement basic problem presentation
3. Add user authentication
4. Develop the guided walkthrough functionality
5. Implement progress tracking
6. Enhance with additional features

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- FastAPI for the backend framework
- React and Material-UI for the frontend
- PostgreSQL for the database
