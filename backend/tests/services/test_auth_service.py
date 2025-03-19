import pytest
from fastapi import HTTPException
from app.services.auth_service import (
    get_user_by_email,
    get_user_by_username,
    create_user,
    authenticate_user,
    create_user_token
)
from app.schemas.user import UserCreate
from app.db.models import User

class TestAuthService:
    """Test authentication service functions."""

    def test_get_user_by_email(self, db_session):
        """Test getting a user by email."""
        # Create a test user
        user = User(
            email="service_test@example.com",
            username="service_test",
            hashed_password="hashed_password"
        )
        db_session.add(user)
        db_session.commit()

        # Test getting existing user
        db_user = get_user_by_email(db_session, "service_test@example.com")
        assert db_user is not None
        assert db_user.email == "service_test@example.com"
        assert db_user.username == "service_test"

        # Test getting non-existent user
        db_user = get_user_by_email(db_session, "nonexistent@example.com")
        assert db_user is None

    def test_get_user_by_username(self, db_session):
        """Test getting a user by username."""
        # Create a test user
        user = User(
            email="username_test@example.com",
            username="username_test",
            hashed_password="hashed_password"
        )
        db_session.add(user)
        db_session.commit()

        # Test getting existing user
        db_user = get_user_by_username(db_session, "username_test")
        assert db_user is not None
        assert db_user.email == "username_test@example.com"
        assert db_user.username == "username_test"

        # Test getting non-existent user
        db_user = get_user_by_username(db_session, "nonexistent")
        assert db_user is None

    def test_create_user(self, db_session):
        """Test creating a new user."""
        # Test creating a new user
        user_create = UserCreate(
            email="create_test@example.com",
            username="create_test",
            password="password123"
        )
        db_user = create_user(db_session, user_create)
        assert db_user.email == "create_test@example.com"
        assert db_user.username == "create_test"
        assert db_user.hashed_password != "password123"  # Password should be hashed

        # Test creating a user with duplicate email
        duplicate_email = UserCreate(
            email="create_test@example.com",
            username="different_username",
            password="password123"
        )
        with pytest.raises(HTTPException) as excinfo:
            create_user(db_session, duplicate_email)
        assert excinfo.value.status_code == 400
        assert "Email already registered" in excinfo.value.detail

        # Test creating a user with duplicate username
        duplicate_username = UserCreate(
            email="different@example.com",
            username="create_test",
            password="password123"
        )
        with pytest.raises(HTTPException) as excinfo:
            create_user(db_session, duplicate_username)
        assert excinfo.value.status_code == 400
        assert "Username already taken" in excinfo.value.detail

    def test_authenticate_user(self, db_session):
        """Test user authentication."""
        # Create a test user with a known password hash
        from app.core.security import get_password_hash
        hashed_password = get_password_hash("testpassword")
        user = User(
            email="auth_test@example.com",
            username="auth_test",
            hashed_password=hashed_password
        )
        db_session.add(user)
        db_session.commit()

        # Test successful authentication
        authenticated_user = authenticate_user(db_session, "auth_test", "testpassword")
        assert authenticated_user is not None
        assert authenticated_user.username == "auth_test"

        # Test failed authentication - wrong password
        authenticated_user = authenticate_user(db_session, "auth_test", "wrongpassword")
        assert authenticated_user is None

        # Test failed authentication - user doesn't exist
        authenticated_user = authenticate_user(db_session, "nonexistent", "testpassword")
        assert authenticated_user is None

    def test_create_user_token(self, db_session):
        """Test token creation for a user."""
        # Create a test user
        user = User(
            email="token_test@example.com",
            username="token_test",
            hashed_password="hashed_password"
        )
        db_session.add(user)
        db_session.commit()

        # Test token creation
        token_data = create_user_token(user)
        assert "access_token" in token_data
        assert token_data["token_type"] == "bearer"
        assert len(token_data["access_token"]) > 0
