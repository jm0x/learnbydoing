import pytest
from fastapi import status

class TestAuthAPI:
    """Test authentication API endpoints."""

    def test_register_user(self, client):
        """Test user registration."""
        # Test successful registration
        user_data = {
            "email": "newuser@example.com",
            "username": "newuser",
            "password": "securepassword123"
        }
        response = client.post("/api/v1/auth/register", json=user_data)
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == user_data["email"]
        assert data["username"] == user_data["username"]
        assert "id" in data
        assert "is_active" in data
        assert "hashed_password" not in data

        # Test duplicate username
        duplicate_user = {
            "email": "another@example.com",
            "username": "newuser",
            "password": "password123"
        }
        response = client.post("/api/v1/auth/register", json=duplicate_user)
        assert response.status_code == 400
        assert "Username already taken" in response.json()["detail"]

        # Test duplicate email
        duplicate_email = {
            "email": "newuser@example.com",
            "username": "anotheruser",
            "password": "password123"
        }
        response = client.post("/api/v1/auth/register", json=duplicate_email)
        assert response.status_code == 400
        assert "Email already registered" in response.json()["detail"]

    def test_login(self, client, test_user):
        """Test user login and token generation."""
        # Test successful login
        response = client.post(
            "/api/v1/auth/token",
            data={
                "username": test_user["username"],
                "password": test_user["password"]
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

        # Test invalid credentials
        response = client.post(
            "/api/v1/auth/token",
            data={
                "username": test_user["username"],
                "password": "wrongpassword"
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        assert response.status_code == 401
        assert "Incorrect username or password" in response.json()["detail"]

        # Test non-existent user
        response = client.post(
            "/api/v1/auth/token",
            data={
                "username": "nonexistentuser",
                "password": "password123"
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        assert response.status_code == 401
        assert "Incorrect username or password" in response.json()["detail"]

    def test_get_current_user(self, client, test_user_token, test_user):
        """Test getting current user information."""
        # Test with valid token
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {test_user_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == test_user["username"]
        assert data["email"] == test_user["email"]
        assert "id" in data
        assert "is_active" in data
        assert "hashed_password" not in data

        # Test with invalid token
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": "Bearer invalidtoken"}
        )
        assert response.status_code == 401
        assert "Could not validate credentials" in response.json()["detail"]

        # Test without token
        response = client.get("/api/v1/auth/me")
        assert response.status_code == 401
        assert "Not authenticated" in response.json()["detail"]
