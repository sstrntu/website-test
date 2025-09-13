"""
Unit tests for the main FastAPI application.

Tests basic endpoints, CORS configuration, and API responses.
Following the three-test pattern: expected use, edge case, failure case.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestRootEndpoint:
    """Tests for the root endpoint (/.)"""
    
    def test_root_endpoint_returns_success(self):
        """
        Test that root endpoint returns successful response.
        Expected use case.
        """
        response = client.get("/")
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data
        assert "status" in data
        assert data["status"] == "operational"
    
    def test_root_endpoint_content_type(self):
        """
        Test that root endpoint returns correct content type.
        Edge case for content validation.
        """
        response = client.get("/")
        
        assert response.headers["content-type"] == "application/json"
    
    def test_root_endpoint_with_invalid_method(self):
        """
        Test that root endpoint rejects invalid HTTP methods.
        Failure case.
        """
        response = client.post("/")
        
        assert response.status_code == 405  # Method Not Allowed


class TestHealthEndpoint:
    """Tests for the health check endpoint (/health)."""
    
    def test_health_check_returns_healthy(self):
        """
        Test that health check returns healthy status.
        Expected use case.
        """
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "service" in data
        assert "version" in data
    
    def test_health_check_response_structure(self):
        """
        Test that health check response has correct structure.
        Edge case for response validation.
        """
        response = client.get("/health")
        data = response.json()
        
        required_fields = ["status", "service", "version"]
        for field in required_fields:
            assert field in data, f"Missing required field: {field}"
    
    def test_health_check_with_head_request(self):
        """
        Test health check with HEAD request (monitoring use case).
        Edge case for monitoring tools.
        """
        response = client.head("/health")
        
        # HEAD requests should return same status but no body
        assert response.status_code == 200
        assert response.content == b""


class TestStadiumInfoEndpoint:
    """Tests for the stadium info endpoint (/api/stadium/info)."""
    
    def test_stadium_info_returns_data(self):
        """
        Test that stadium info endpoint returns expected data.
        Expected use case.
        """
        response = client.get("/api/stadium/info")
        
        assert response.status_code == 200
        data = response.json()
        
        # Validate required fields
        assert "name" in data
        assert "type" in data
        assert "capacity" in data
        assert "features" in data
        
        # Validate data types
        assert isinstance(data["capacity"], int)
        assert isinstance(data["features"], list)
        assert data["type"] == "football"
    
    def test_stadium_info_features_list(self):
        """
        Test that stadium features list contains expected items.
        Edge case for feature validation.
        """
        response = client.get("/api/stadium/info")
        data = response.json()
        
        features = data["features"]
        expected_features = [
            "3D visualization",
            "Interactive camera controls"
        ]
        
        for feature in expected_features:
            assert feature in features
    
    def test_stadium_info_with_query_params(self):
        """
        Test stadium info endpoint ignores unexpected query parameters.
        Failure case for parameter handling.
        """
        response = client.get("/api/stadium/info?invalid=param")
        
        # Should still return 200 and ignore invalid params
        assert response.status_code == 200
        data = response.json()
        assert "name" in data


class TestCORSConfiguration:
    """Tests for CORS middleware configuration."""
    
    def test_cors_preflight_request(self):
        """
        Test CORS preflight request handling.
        Expected use case for frontend integration.
        """
        headers = {
            "Origin": "http://localhost:3006",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "Content-Type"
        }
        
        response = client.options("/", headers=headers)
        
        # Should allow the request
        assert response.status_code == 200
        assert "access-control-allow-origin" in response.headers
    
    def test_cors_actual_request(self):
        """
        Test actual CORS request with origin header.
        Expected use case.
        """
        headers = {"Origin": "http://localhost:3006"}
        
        response = client.get("/", headers=headers)
        
        assert response.status_code == 200
        assert "access-control-allow-origin" in response.headers
    
    def test_cors_unauthorized_origin(self):
        """
        Test CORS with unauthorized origin.
        Edge case for security.
        """
        headers = {"Origin": "http://malicious-site.com"}
        
        response = client.get("/", headers=headers)
        
        # Should still return 200 but may not include CORS headers
        # (exact behavior depends on CORS middleware configuration)
        assert response.status_code == 200


class TestAPIDocumentation:
    """Tests for API documentation endpoints."""
    
    def test_openapi_docs_accessible(self):
        """
        Test that OpenAPI documentation is accessible.
        Expected use case for development.
        """
        response = client.get("/docs")
        
        assert response.status_code == 200
        # Should return HTML content
        assert "text/html" in response.headers.get("content-type", "")
    
    def test_redoc_docs_accessible(self):
        """
        Test that ReDoc documentation is accessible.
        Edge case for alternative documentation.
        """
        response = client.get("/redoc")
        
        assert response.status_code == 200
        assert "text/html" in response.headers.get("content-type", "")
    
    def test_openapi_json_schema(self):
        """
        Test that OpenAPI JSON schema is valid.
        Edge case for API schema validation.
        """
        response = client.get("/openapi.json")
        
        assert response.status_code == 200
        assert response.headers["content-type"] == "application/json"
        
        data = response.json()
        assert "openapi" in data
        assert "info" in data
        assert "paths" in data