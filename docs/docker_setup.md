# Docker Setup

## Overview

The Learn By Doing project uses Docker and Docker Compose for containerization, providing a consistent development and deployment environment. This document outlines the Docker configuration, container architecture, and usage instructions.

## Container Architecture

The application consists of three main containers:

1. **Frontend Container**: React.js application
2. **Backend Container**: Python FastAPI application
3. **Database Container**: PostgreSQL database

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  React Frontend │◄────►│  Python Backend │◄────►│    PostgreSQL   │
│    (Port 3000)  │      │    (Port 9090)  │      │    (Port 5432)  │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## Docker Compose Configuration

The `docker-compose.yml` file defines the multi-container application:

```yaml
version: '3'

services:
  # PostgreSQL Database
  db:
    image: postgres:13
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    env_file:
      - ./.env
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=learnbydoing
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  # Python FastAPI Backend
  backend:
    build:
      context: .
      dockerfile: backend.Dockerfile
    depends_on:
      - db
    ports:
      - "9090:8000"  # Map host port 9090 to container port 8000
    env_file:
      - ./.env
    environment:
      - POSTGRES_SERVER=db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=learnbydoing
    volumes:
      - ./backend:/app
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
```

## Dockerfiles

### Backend Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend /app/

# Create non-root user
RUN adduser --disabled-password --gecos "" appuser && \
    chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Environment Variables

The application uses environment variables for configuration:

### Backend Environment Variables

- `POSTGRES_SERVER`: Database hostname (default: "db")
- `POSTGRES_USER`: Database username (default: "postgres") 
- `POSTGRES_PASSWORD`: Database password (default: "postgres")
- `POSTGRES_DB`: Database name (default: "learnbydoing")
- `SECRET_KEY`: JWT secret key (default: "supersecretkey")

## Development Workflow

### Starting the Application

```bash
# Start all containers
docker-compose up

# Start in detached mode
docker-compose up -d

# Start specific service
docker-compose up backend
```

### Stopping the Application

```bash
# Stop all containers
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Viewing Logs

```bash
# View logs for all containers
docker-compose logs

# View logs for specific container
docker-compose logs backend

# Follow logs
docker-compose logs -f
```

### Rebuilding Containers

```bash
# Rebuild all containers
docker-compose build

# Rebuild specific container
docker-compose build backend
```

## Database Management

### Accessing the Database

```bash
# Connect to PostgreSQL container
docker-compose exec db psql -U postgres -d learnbydoing

# Run SQL file
docker-compose exec -T db psql -U postgres -d learnbydoing < database/init.sql
```

### Database Migrations

Database migrations are handled with Alembic:

```bash
# Run migrations
docker-compose exec backend alembic upgrade head

# Create new migration
docker-compose exec backend alembic revision --autogenerate -m "description"
```

## Port Configuration

The application uses the following ports:

- **Frontend**: Port 3000
- **Backend**: Port 9090 (mapped to container port 8000)
- **Database**: Port 5432 (internal only)

## Volume Management

The application uses Docker volumes for persistent data:

- **postgres_data**: Stores PostgreSQL database files

## Health Checks

Both the database and backend containers include health checks:

- **Database**: Checks if PostgreSQL is ready to accept connections
- **Backend**: Checks if the API is responding

## Security Considerations

- **Non-root Users**: Containers run as non-root users
- **Minimal Base Images**: Uses slim variants to reduce attack surface
- **Environment Variables**: Sensitive data stored in environment variables
- **Volume Permissions**: Proper permissions on mounted volumes

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Check if the database container is running
   - Verify environment variables are correct
   - Ensure the database has been initialized

2. **Port Conflicts**:
   - Check if ports 9090 or 3000 are already in use
   - Change port mappings in docker-compose.yml if needed

3. **Volume Permission Issues**:
   - Check ownership of mounted volumes
   - Ensure proper permissions on host directories

### Debugging Commands

```bash
# Check container status
docker-compose ps

# Inspect container
docker inspect <container_id>

# View container resources
docker stats

# Check network connectivity
docker-compose exec backend ping db
```

## Production Deployment

For production deployment, consider the following modifications:

1. **Environment Variables**: Use production-specific values
2. **Volumes**: Use named volumes or external storage
3. **Networking**: Configure proper network isolation
4. **Scaling**: Consider container orchestration (Kubernetes, Docker Swarm)
5. **Monitoring**: Add monitoring and logging solutions
