# Talavera SaaS - Useful Commands Reference

## 🚀 Quick Start Commands

### Initial Setup (One Time)
```bash
# Install all dependencies
npm install -w api
npm install -w web

# Start Docker stack
npm run docker:up

# Wait 15 seconds for database to be ready
# Then run migrations and seeds
npm run db:setup -w api

# Verify everything works
npm run test -w api
# Expected: PASS ✓ 2 passed
```

### Start Development
```bash
# Terminal 1: Backend API (http://localhost:3001)
npm run dev:api

# Terminal 2: Frontend (http://localhost:3000)
npm run dev:web
```

### Testing

#### Backend Tests
```bash
# Run all tests once
npm run test -w api

# Run tests in watch mode (auto-reload on changes)
npm run test:watch -w api

# Run specific test file
npm run test src/__tests__/health.test.ts -w api

# Generate coverage report (creates coverage/ folder)
npm run test:coverage -w api

# Clear Vitest cache
npm run test -w api -- --clearCache
```

#### Frontend Tests
```bash
# Run all React tests once
npm run test -w web

# Run in watch mode
npm run test:watch -w web

# Coverage report
npm run test:coverage -w web
```

## 🐳 Docker Commands

### Start/Stop
```bash
# Start all services (API + Frontend + PostgreSQL)
npm run docker:up

# Stop all services (keeps data)
npm run docker:down

# Stop and remove all volumes (deletes data!)
docker-compose down -v

# View logs in real-time
npm run docker:logs

# View logs for specific service
docker-compose logs -f db
docker-compose logs -f api
docker-compose logs -f web
```

### Database Management

```bash
# Access PostgreSQL shell
docker exec -it talavera-postgres psql -U talavera_user -d talavera_saas

# In psql shell:
\dt              # List all tables
\d users         # Describe users table
SELECT * FROM users;
SELECT * FROM plans;
\q              # Exit

# Run migrations
npm run db:migrate -w api

# Rollback last migration
npm run db:rollback -w api

# Run seeds (insert data)
npm run db:seed -w api

# Full setup (migrate + seed)
npm run db:setup -w api

# Reset database (down + up)
npm run docker:down -v
npm run docker:up
npm run db:setup -w api
```

## 🏗️ Build & Deployment

### Build for Production
```bash
# Build backend
npm run build:api

# Build frontend
npm run build:web

# Check build output
ls api/dist/
ls web/build/
```

### Running Production Build
```bash
# Backend production server
NODE_ENV=production npm start -w api

# Frontend production server (requires serving)
npm run build -w web
# Then use a static server or deploy to CDN
```

## 🔧 Development Utilities

### TypeScript Compilation
```bash
# Compile backend TypeScript
npm run build:api

# Check for TypeScript errors without compiling
cd api && npx tsc --noEmit

cd web && npx tsc --noEmit
```

### Linting & Formatting (Future Enhancement)
```bash
# Add ESLint
npm install --save-dev eslint

# Add Prettier
npm install --save-dev prettier
```

## 📊 Monitoring & Debugging

### View API Health
```bash
# Check if API is running
curl http://localhost:3001/health

# Should return:
# {"status":"ok"}

# On Windows PowerShell:
Invoke-RestMethod http://localhost:3001/health
```

### Check Database Connection
```bash
# From inside container
docker exec -it talavera-postgres pg_isready -U talavera_user

# Should return: accepting connections
```

### View Docker Network
```bash
# List all containers
docker ps

# Inspect network
docker network ls
docker network inspect talavera_default
```

## 📁 File & Directory Management

### List Project Structure
```bash
# Tree view (if tree command available)
tree -L 2 -I 'node_modules'

# Or use find
find . -type d -not -path '*/node_modules/*' -not -path '*/.git/*' | head -20
```

### Check Disk Usage
```bash
# Size of node_modules
du -sh node_modules
du -sh api/node_modules
du -sh web/node_modules

# Size of Docker volumes
docker system df
```

### Clean Up
```bash
# Remove all Docker images and containers
docker system prune -a

# Remove stopped containers
docker container prune

# Remove dangling volumes
docker volume prune

# Clean npm cache
npm cache clean --force
```

## 🔍 Troubleshooting Commands

### Port Already in Use
```bash
# Windows PowerShell: Find process on port
Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue

# Kill process (replace PID)
Stop-Process -Id <PID> -Force

# Or change port in .env and docker-compose.yml
```

### Database Connection Issues
```bash
# Check if PostgreSQL container is running
docker ps | grep postgres

# Check database logs
docker-compose logs db

# Reset database
npm run docker:down -v
npm run docker:up
npm run db:setup -w api
```

### Node Version Issues
```bash
# Check Node version
node --version

# Install Node version manager
# Windows: https://github.com/nvm-sh/nvm-windows
# Mac/Linux: https://github.com/nvm-sh/nvm

# Use specific version
nvm use 20
```

### Git Operations (When Ready)

```bash
# Initialize git repo
git init

# Add all files
git add .

# Commit initial scaffolding
git commit -m "feat: Tier 0 - Initial scaffolding and configuration"

# Create branches for each tier
git branch tier-1-auth-projects
git branch tier-2-subscriptions
git branch tier-3-finalization

# Switch to tier branch
git checkout tier-1-auth-projects

# Commit tier 1 work
git add .
git commit -m "feat(tier1): Implement Auth and Projects endpoints"

# Push to remote (when ready)
git push -u origin tier-1-auth-projects
```

## 📈 Performance Monitoring

### API Response Times
```bash
# Test endpoint with timing
time curl http://localhost:3001/health

# Or use wrk for load testing (if installed)
wrk -t2 -c10 -d10s http://localhost:3001/health
```

### Database Query Performance
```bash
# In PostgreSQL shell, enable query timing
\timing

# Run query
SELECT * FROM users;

# See execution time
```

### Memory Usage
```bash
# Check Node process memory
node --max-old-space-size=4096 <script.js>

# Monitor during development
npm run dev:api -- --inspect
# Open chrome://inspect in Chrome DevTools
```

## 🎯 Tier-Specific Commands

### Tier 0 Verification
```bash
npm run test -w api                    # Health check test passes
npm run docker:up                       # All services start
npm run db:setup -w api                # Migrations run successfully
```

### Tier 1 Development
```bash
npm run test:watch -w api              # Tests in watch mode
npm run test -w api -- auth.test.ts    # Run auth tests
npm run test:coverage -w api           # Check coverage
```

### Tier 2 Development
```bash
npm run test:watch -w api              # Watch for changes
npm run test -w api -- subscriptions   # Test subscriptions
npm run test:coverage -w api           # Coverage for tier 2
```

## 📚 Additional Resources

### Documentation Files
```bash
# Read setup guide
cat TIER0_SETUP.md

# Read implementation guide for tier 1
cat TIER1_GUIDE.md

# Read implementation guide for tier 2
cat TIER2_GUIDE.md

# Read architecture decisions
cat ARCHITECTURE_DECISIONS.md

# Track AI usage
cat AI_USAGE.md
```

## ⏰ Time Tracking

```bash
# Start timer for tier 1
date  # Note the time

# After implementation
date  # Note the end time

# Calculate duration
# Use online time calculator or:
# Hours = (end_time - start_time) / 60 / 60
```

---

**Version**: 1.0
**Last Updated**: 2025-10-24
**For Project**: Talavera SaaS 8-Hour Exercise
