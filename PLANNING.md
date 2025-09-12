# Project Planning - 3D Stadium Website

## Project Overview
Interactive 3D football stadium website built with Three.js frontend and Python backend infrastructure, inspired by Jesse Zhou's cinematic techniques.

## Architecture & Goals
- **Frontend**: TypeScript/JavaScript with Three.js for 3D rendering
- **Backend**: Python with FastAPI for API services (prepared for future expansion)
- **Development**: Docker containers for consistent environment
- **Deployment**: Containerized services

## Current Features
- Interactive 3D stadium model with cinematic lighting
- Dramatic zoom-in intro sequence from far to close view
- Enhanced bloom post-processing effects
- Reflective ground plane and atmospheric particles
- Smooth GSAP camera transitions and controls
- Performance optimization based on device capabilities

## Style & Technical Constraints
- Follow Jesse Zhou's cinematic techniques: baked lighting, bloom effects, reflections
- Use Docker containers as primary development environment
- TypeScript strict mode for frontend code
- Python 3.9+ with type hints for backend
- No files longer than 500 lines - modularize when approaching limit
- Use Supabase for database operations (when backend features are added)

## File Structure Compliance
```
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI application
│   │   ├── models/          # Database models
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   └── utils/           # Helper functions
│   ├── tests/               # Backend tests
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile          # Backend container config
│   └── README.md           # Backend documentation
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Frontend utilities
│   │   └── main.ts         # Main application entry
│   ├── assets/             # Static assets (models, textures)
│   ├── package.json        # Frontend dependencies
│   ├── Dockerfile          # Frontend container config
│   └── tsconfig.json       # TypeScript configuration
├── docker-compose.yml      # Multi-service orchestration
├── .dockerignore          # Docker build exclusions
├── docs/                   # Project documentation
├── PLANNING.md            # This file
└── TASK.md                # Task tracking
```

## Current Implementation Status
- ✅ 3D stadium rendering with GLTFLoader
- ✅ Cinematic intro zoom sequence
- ✅ Enhanced lighting and post-processing
- ✅ Interactive camera controls
- ✅ Performance optimization
- 🔄 Organizing into proper project structure
- ⏳ Backend infrastructure setup
- ⏳ Docker containerization
- ⏳ TypeScript migration for frontend

## Next Development Phases
1. **Structure Organization** - Move to proper backend/frontend structure
2. **Containerization** - Docker setup for development and deployment  
3. **Backend API** - FastAPI setup for future features
4. **TypeScript Migration** - Convert frontend to proper TypeScript
5. **Feature Expansion** - Interactive hotspots, analytics, user preferences

## Development Commands
```bash
# Current (temporary)
python3 -m http.server 3006

# Future (after dockerization)
docker-compose up --build
docker-compose exec backend python -m pytest
docker-compose exec frontend npm run dev
```