"""
Main FastAPI application for 3D Stadium Website backend.

This backend is prepared for future expansion to support:
- Stadium data API endpoints
- User preference management  
- Analytics and usage tracking
- Real-time stadium information
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from typing import Dict, Any

# Initialize FastAPI application
app = FastAPI(
    title="3D Stadium Website API",
    description="Backend API for interactive 3D stadium visualization",
    version="0.1.0"
)

# Configure CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3006", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root() -> Dict[str, str]:
    """
    Root endpoint providing basic API information.
    
    Returns:
        dict: Basic API status and information
    """
    return {
        "message": "3D Stadium Website API",
        "version": "0.1.0",
        "status": "operational"
    }

@app.get("/health")
async def health_check() -> Dict[str, Any]:
    """
    Health check endpoint for monitoring and deployment.
    
    Returns:
        dict: Service health status and basic metrics
    """
    return {
        "status": "healthy",
        "service": "3d-stadium-backend",
        "version": "0.1.0"
    }

@app.get("/api/stadium/info")
async def get_stadium_info() -> Dict[str, Any]:
    """
    Get basic stadium information.
    Placeholder for future stadium data integration.
    
    Returns:
        dict: Stadium metadata and information
    """
    return {
        "name": "Interactive Football Stadium",
        "type": "football",
        "capacity": 50000,
        "features": [
            "3D visualization",
            "Interactive camera controls", 
            "Cinematic lighting effects",
            "Bloom post-processing",
            "Atmospheric particles"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)