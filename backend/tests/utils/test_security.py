import pytest
import time
from datetime import timedelta, datetime, timezone
from jose import jwt

from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    verify_token
)
from app.core.config import settings
from fastapi import HTTPException

class TestSecurity:
    """Test security utility functions."""

    def test_password_hashing(self):
        """Test password hashing and verification."""
        password = "testpassword123"
        hashed = get_password_hash(password)
        
        # Verify the hash is different from the original password
        assert hashed != password
        
        # Verify the password against its hash
        assert verify_password(password, hashed) is True
        
        # Verify an incorrect password fails
        assert verify_password("wrongpassword", hashed) is False

    def test_create_access_token(self):
        """Test JWT token creation."""
        data = {"sub": "testuser"}
        
        # Test with default expiration
        token = create_access_token(data)
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        assert payload["sub"] == "testuser"
        assert "exp" in payload
        
        # Test with custom expiration
        expires = timedelta(minutes=30)
        token = create_access_token(data, expires_delta=expires)
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        assert payload["sub"] == "testuser"
        assert "exp" in payload
        
        # Verify expiration time is set correctly (within 1 second tolerance)
        expected_exp = datetime.now(timezone.utc) + expires
        assert abs(payload["exp"] - expected_exp.timestamp()) < 1

    def test_verify_token(self):
        """Test JWT token verification."""
        # Create a valid token
        data = {"sub": "testuser"}
        token = create_access_token(data)
        
        # Create an exception to raise on failure
        credentials_exception = HTTPException(
            status_code=401,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        # Test valid token verification
        payload = verify_token(token, credentials_exception)
        assert payload["sub"] == "testuser"
        
        # Test invalid token verification
        with pytest.raises(HTTPException) as excinfo:
            verify_token("invalid.token.string", credentials_exception)
        assert excinfo.value.status_code == 401
        assert "Could not validate credentials" in excinfo.value.detail
        
        # Test expired token verification
        expired_data = {"sub": "testuser", "exp": datetime.now(timezone.utc).timestamp() - 1}
        expired_token = jwt.encode(expired_data, settings.SECRET_KEY, algorithm="HS256")
        with pytest.raises(HTTPException) as excinfo:
            verify_token(expired_token, credentials_exception)
        assert excinfo.value.status_code == 401
