# Talavera SaaS - Tier 0 Setup Checklist

## ✅ Completed

### Repository Configuration
- [x] Monorepo structure with `api/` and `web/` workspaces
- [x] Root `package.json` with workspace configuration
- [x] Strict `tsconfig.json` for both backend and frontend

### Docker Infrastructure
- [x] `docker-compose.yml` with:
  - PostgreSQL 15+ service with health check
  - API service that waits for DB readiness
  - Frontend service (React)
- [x] `.dockerignore` files for both services

### Backend (API)
- [x] Express.js entry point (`src/index.ts`)
- [x] Knex.js database configuration (`knexfile.js`)
- [x] Database migrations (users, projects, plans, subscriptions, invoices)
- [x] Database seeds for plans

### Test Harness (Backend)
- [x] Vitest configuration (`vitest.config.ts`)
- [x] Supertest setup for HTTP testing
- [x] Smoke test: Health check endpoint (`src/__tests__/health.test.ts`)
- [x] Ready to run: `npm run test`

### BDD/Gherkin Features
- [x] `features/auth.feature` - Sign up/Sign in scenarios
- [x] `features/projects.feature` - Project CRUD & quota scenarios
- [x] `features/subscriptions.feature` - Subscription upgrade scenarios

### Frontend (React)
- [x] React 18 setup with TypeScript
- [x] i18n configuration (English & Spanish)
- [x] SignIn component with validation (Zod)
- [x] RTL test suite for SignIn component
- [x] Localized error messages

## 📋 Next Steps (Tier 0 → Tier 1)

### Before Running
1. **Install Dependencies**
   ```bash
   npm install
   npm install -w api
   npm install -w web
   ```

2. **Verify Test Harness**
   ```bash
   npm run test -w api
   ```

3. **Start Docker Stack**
   ```bash
   npm run docker:up
   ```

4. **Run Migrations**
   ```bash
   # Once API is running
   npm run db:setup -w api
   ```

### Tier 1 Tasks
- [ ] Implement Auth controllers/services/repos (RED → GREEN)
- [ ] Implement Project CRUD endpoints
- [ ] Implement quota checking middleware
- [ ] Implement Plan endpoints
- [ ] Add frontend API integration
- [ ] Write integration tests

## 📊 Project Structure

```
talavera/
├── api/
│   ├── src/
│   │   ├── __tests__/
│   │   ├── index.ts
│   │   └── db.ts
│   ├── migrations/
│   ├── seeds/
│   ├── knexfile.js
│   ├── vitest.config.ts
│   └── tsconfig.json
├── web/
│   ├── src/
│   │   ├── components/
│   │   ├── i18n/
│   │   ├── __tests__/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   └── tsconfig.json
├── features/
│   ├── auth.feature
│   ├── projects.feature
│   └── subscriptions.feature
└── docker-compose.yml
```

## 🔑 Key Technologies

- **Backend**: Express, TypeScript, Knex, PostgreSQL, Vitest, Supertest
- **Frontend**: React 18, TypeScript, React Testing Library, i18next, Zod
- **Infrastructure**: Docker Compose, PostgreSQL 15
- **Methodology**: BDD/TDD-first with Gherkin features

## 📝 Environment Variables

### API (.env)
```env
NODE_ENV=development
DATABASE_URL=postgresql://talavera_user:talavera_password@db:5432/talavera_saas
JWT_SECRET=dev-secret-key-change-in-production
PORT=3001
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001
```
