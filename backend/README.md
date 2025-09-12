# 3D Stadium Website - Backend API

FastAPI backend service for the 3D stadium visualization website.

## 🚀 Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or using Docker
docker build -t stadium-backend .
docker run -p 8000:8000 stadium-backend
```

## 📚 API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🛠️ Development

### Testing
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test
pytest tests/test_main.py::test_root
```

### Code Quality
```bash
# Format code
black .

# Lint code  
flake8

# Type checking
mypy app/
```

## 🔧 Environment Variables

Create `.env` file with:
```env
ENVIRONMENT=development
DEBUG=True
# Add other configuration variables as needed
```

## 📁 Structure

```
app/
├── __init__.py
├── main.py         # FastAPI application
├── models/         # Database models (future)
├── routes/         # API endpoints (future)
├── services/       # Business logic (future)  
└── utils/          # Helper functions (future)
```

## 🔮 Future API Endpoints

Planned endpoints for expansion:

- `GET /api/stadium/info` - Stadium metadata
- `GET /api/stadium/models` - Available 3D models
- `POST /api/user/preferences` - Save user settings
- `GET /api/analytics/views` - Usage analytics
- `GET /api/stadium/realtime` - Live stadium data

## 🏗️ Architecture

- **Framework**: FastAPI with async support
- **Validation**: Pydantic models  
- **Database**: Prepared for Supabase integration
- **Authentication**: Ready for JWT implementation
- **Testing**: Pytest with async support