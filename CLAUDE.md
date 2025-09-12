# Claude Instructions

## 🔄 Project Awareness & Context
- **Always read `PLANNING.md`** at the start of a new conversation to understand the project's architecture, goals, style, and constraints.
- **Check `TASK.md`** before starting a new task. If the task isn't listed, add it with a brief description and today's date.
- **Use consistent naming conventions, file structure, and architecture patterns** as described in `PLANNING.md`.
- **Use Docker containers** as the primary development environment instead of virtual environments.

## Project Overview
Backend applications built with Python, with TypeScript for any frontend components.

## Project Structure
```
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── README.md
├── frontend/ (if applicable)
│   ├── src/
│   │   ├── components/
│   │   ├── types/
│   │   ├── utils/
│   │   └── main.ts
│   ├── package.json
│   ├── Dockerfile
│   └── tsconfig.json
├── docker-compose.yml
├── .dockerignore
├── docs/
├── PLANNING.md
└── TASK.md
```

## 🧱 Code Structure & Modularity
- **Never create a file longer than 500 lines of code.** If a file approaches this limit, refactor by splitting it into modules or helper files.
- **Organize code into clearly separated modules**, grouped by feature or responsibility.
  For agents this looks like:
    - `agent.py` - Main agent definition and execution logic 
    - `tools.py` - Tool functions used by the agent 
    - `prompts.py` - System prompts
- **Use clear, consistent imports** (prefer relative imports within packages).
- **Use python_dotenv and load_env()** for environment variables.

## Development Guidelines

### Python Backend
- Use Python 3.9+ with type hints
- Follow PEP 8 style guidelines
- Use FastAPI or Flask for web frameworks
- Use Supabase for database and authentication
- Implement proper error handling and logging
- Use Docker for development and deployment environments
- Structure code with clear separation of concerns
- Use `pydantic` for data validation
- Use `python_dotenv` and `load_env()` for environment variables

### TypeScript Frontend (when applicable)
- Use strict TypeScript configuration
- Follow consistent naming conventions (camelCase for variables, PascalCase for components)
- Use modern ES6+ features
- Implement proper type definitions
- Use functional programming patterns where appropriate

### 📎 Style & Conventions
- **Use Python** as the primary language.
- **Follow PEP8**, use type hints, and format with `black`.
- **Use `pydantic` for data validation**.
- Use `FastAPI` for APIs and `SQLModel` for ORM if applicable.
- Write **docstrings for every function** using the Google style:
  ```python
  def example():
      """
      Brief summary.
      Args:
          param1 (type): Description.
      Returns:
          type: Description.
      """
  ```

## 🧪 Testing & Reliability
- **Always create Pytest unit tests for new features** (functions, classes, routes, etc).
- **After updating any logic**, check whether existing unit tests need to be updated. If so, do it.
- **Tests should live in a `/tests` folder** mirroring the main app structure.
  - Include at least:
    - 1 test for expected use
    - 1 edge case
    - 1 failure case
- Python: Use pytest for testing
- TypeScript: Use Jest or Vitest for testing
- Aim for good test coverage (>80%)
- Write both unit and integration tests
- Mock external dependencies in tests

## 📚 Documentation & Explainability
- **Update `README.md`** when new features are added, dependencies change, or setup steps are modified.
- **Comment non-obvious code** and ensure everything is understandable to a mid-level developer.
- When writing complex logic, **add an inline `# Reason:` comment** explaining the why, not just the what.
- Keep README.md updated with setup instructions
- Document API endpoints and their schemas
- Include example usage in docstrings
- Maintain changelog for significant updates

## Specific Instructions for Claude

### 🧠 AI Behavior Rules
- **Never assume missing context. Ask questions if uncertain.**
- **Never hallucinate libraries or functions** – only use known, verified Python packages.
- **Always confirm file paths and module names** exist before referencing them in code or tests.
- **Never delete or overwrite existing code** unless explicitly instructed to or if part of a task from `TASK.md`.
- **🔒 CRITICAL SECURITY RULE: Frontend must NEVER connect directly to Supabase** - All database operations must go through Backend API only.
- **Always implement the Backend-as-Proxy pattern** for Supabase operations.

### When working with Python:
1. Always use type hints for function parameters and return types
2. Follow the project's existing import organization
3. Use proper exception handling with specific exception types
4. Implement logging instead of print statements for debugging
5. Use environment variables for configuration
6. Use Supabase client for database operations and authentication
7. Follow Supabase's row-level security (RLS) patterns for data access
8. Execute all Python commands within Docker containers
9. Use docker-compose for local development with all services

### When working with TypeScript:
1. Define proper interfaces and types for all data structures
2. Use async/await for asynchronous operations
3. Implement proper error boundaries and error handling
4. Use consistent component structure and naming
5. Leverage TypeScript's strict mode features
6. **NEVER connect directly to Supabase from frontend**
7. **Always use Backend API calls for all data operations**
8. Store only JWT tokens, never Supabase keys in frontend

### General practices:
- Always read existing code patterns before implementing new features
- Maintain consistency with the current architecture
- Ask for clarification on business logic before making assumptions
- Test changes thoroughly before proposing them
- Use descriptive commit messages

### File handling:
- Create backup branches before major refactoring
- Follow the established directory structure
- Use appropriate file extensions (.py, .ts, .tsx)
- Keep configuration files organized and documented
- **ALWAYS exclude large files from git**: ML models, photos, videos, audio files, datasets, and any media files must be added to .gitignore
- Use Git LFS for large files that need version control, or cloud storage for assets

## ✅ Task Completion
- **Mark completed tasks in `TASK.md`** immediately after finishing them.
- Add new sub-tasks or TODOs discovered during development to `TASK.md` under a "Discovered During Work" section.

## Git Configuration

### Important Git Rules:
1. **Never commit large files** - anything over 50MB should be in .gitignore
2. **Use Git LFS** for large files that need version control
3. **Use cloud storage** for media assets
4. **Document where large files are stored** in README.md
5. **Use placeholder files** with instructions on how to obtain large assets

## Dependencies

### Python Backend
- Docker: Containerization for development and deployment
- FastAPI/Flask: Web framework
- supabase: Database client and authentication (preferred over local databases)
- Pydantic: Data validation
- pytest: Testing framework
- black: Code formatting
- flake8: Linting

### TypeScript Frontend (when applicable)
- Vite/Webpack: Build tool
- React/Vue: Frontend framework (specify which)
- Axios: HTTP client
- Jest/Vitest: Testing framework
- ESLint: Linting
- Prettier: Code formatting

## Common Tasks

### Docker Development
- `docker-compose up --build`: Build and start all services
- `docker-compose up -d`: Start services in detached mode
- `docker-compose down`: Stop all services
- `docker-compose exec backend bash`: Access backend container shell
- `docker-compose exec backend python -m pytest`: Run tests in container
- `docker-compose logs -f backend`: Follow backend logs
- `docker-compose exec backend python -m black .`: Format code in container
- `docker-compose exec backend python -m flake8`: Lint code in container

### Python Backend (within container)
- `python app/main.py`: Run development server
- `python -m pytest`: Run tests
- `python -m black .`: Format code
- `python -m flake8`: Lint code
- `pip install -r requirements.txt`: Install dependencies

### TypeScript Frontend (when applicable)
- `docker-compose exec frontend npm install`: Install dependencies
- `docker-compose exec frontend npm run dev`: Start development server
- `docker-compose exec frontend npm run build`: Build for production
- `docker-compose exec frontend npm test`: Run tests
- `docker-compose exec frontend npm run lint`: Lint code
- `docker-compose exec frontend npm run format`: Format code

## Environment Setup
- Use `.env` files for environment variables (mounted into Docker containers)
- Never commit sensitive information (API keys, passwords, Supabase keys)
- Use `.env.example` to document required environment variables
- **Prefer Supabase over local databases** for consistency and built-in features
- Configure Supabase URL and anon key in environment variables
- Use Supabase service role key for server-side operations (keep secure)
- Configure AI tool APIs (OpenAI, Anthropic, etc.) in environment variables
- Use docker-compose.yml for orchestrating development services
- Use .dockerignore to exclude unnecessary files from Docker builds

## Notes
- Prioritize code readability and maintainability
- Use proper logging levels (DEBUG, INFO, WARNING, ERROR)
- Implement proper API versioning when building APIs
- Use Docker for consistent development environments across all team members
- Follow REST API conventions for endpoint design
- **Always prefer Supabase over local databases** for development and production
- Use Supabase's built-in features: real-time subscriptions, edge functions, file storage
- Implement proper row-level security (RLS) policies in Supabase
- Use Supabase's built-in authentication instead of custom auth solutions
- All development should happen within Docker containers for consistency
- Use multi-stage Docker builds for optimized production images