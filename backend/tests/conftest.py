import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.db.models import Base
from app.db.session import get_db
from app.core.config import settings

# Use in-memory SQLite for testing
TEST_SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(scope="session")
def test_engine():
    """Create a test database engine."""
    engine = create_engine(
        TEST_SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def db_session(test_engine):
    """Create a fresh database session for each test."""
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()

@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with a test database."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

# Generate a unique ID for this test run to avoid username/email conflicts
pytest.test_run_id = os.urandom(4).hex()

@pytest.fixture(scope="function")
def test_user(client):
    """Create a test user."""
    user_data = {
        "email": f"testuser{pytest.test_run_id}@example.com",
        "username": f"testuser{pytest.test_run_id}",
        "password": "testpassword123"
    }
    
    # Try to create the user
    response = client.post("/api/v1/auth/register", json=user_data)
    
    # If user already exists (400 Bad Request), try with a different username/email
    if response.status_code == 400:
        user_data = {
            "email": f"testuser{pytest.test_run_id}2@example.com",
            "username": f"testuser{pytest.test_run_id}2",
            "password": "testpassword123"
        }
        response = client.post("/api/v1/auth/register", json=user_data)
        assert response.status_code == 201, f"Failed to create test user: {response.json()}"
    else:
        assert response.status_code == 201, f"Failed to create test user: {response.json()}"
    
    return user_data

@pytest.fixture(scope="function")
def test_user_token(client, test_user):
    """Get a token for the test user."""
    response = client.post(
        "/api/v1/auth/token",
        data={
            "username": test_user["username"],
            "password": test_user["password"]
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code == 200
    return response.json()["access_token"]
