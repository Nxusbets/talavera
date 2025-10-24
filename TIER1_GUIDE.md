# Tier 1: Auth + Projects Implementation Guide

## 🎯 Objectives
- Implement Auth (Sign up, Sign in) with JWT
- Implement Projects CRUD with quota checking
- Connect frontend to backend
- All tests passing (RED → GREEN → REFACTOR)

## 🏗️ Architecture Layers

### Backend: Routes → Controllers → Services → Repositories

```
POST /api/auth/signup
  └─> AuthController.signup()
      └─> AuthService.signup()
          └─> UserRepository.create()
              └─> Database

POST /api/auth/signin
  └─> AuthController.signin()
      └─> AuthService.signin()
          └─> UserRepository.findByEmail()
              └─> Database

POST /api/projects
  └─> ProjectController.create()
      └─> QuotaMiddleware.check()
      └─> ProjectService.create()
          └─> ProjectRepository.create()
              └─> Database
```

## 📋 Implementation Checklist

### Auth Implementation
- [ ] **Schemas** (`src/schemas/auth.ts`)
  - Zod schema for `SignUpRequest`
  - Zod schema for `SignInRequest`
  - Validation for password complexity

- [ ] **Models/Types** (`src/types/index.ts`)
  - `User` interface
  - `AuthToken` interface
  - `SignUpPayload` and `SignInPayload`

- [ ] **Repository** (`src/repositories/UserRepository.ts`)
  - `create(email, hashedPassword, locale)`: Insert user
  - `findByEmail(email)`: Fetch user by email
  - `updateProjectsQuota(userId, newQuota)`: Update quota after plan change
  - `findById(id)`: Fetch user by ID

- [ ] **Service** (`src/services/AuthService.ts`)
  - `signup(email, password, locale)`: Hash password, create user, return JWT
  - `signin(email, password)`: Verify password, return JWT
  - Helper: `hashPassword(password)`
  - Helper: `verifyPassword(password, hash)`
  - Helper: `generateJWT(userId, email)`

- [ ] **Controller** (`src/controllers/AuthController.ts`)
  - `POST /api/auth/signup`
  - `POST /api/auth/signin`
  - Error handling with localized messages

- [ ] **Routes** (`src/routes/auth.ts`)
  - Register endpoints

### Projects Implementation
- [ ] **Middleware** (`src/middleware/authMiddleware.ts`)
  - Extract JWT from header
  - Verify token
  - Attach `req.user` (userId)

- [ ] **Middleware** (`src/middleware/quotaMiddleware.ts`)
  - Check if user has reached quota before project creation
  - Return 403 with `errors.quota_exceeded` if limit reached

- [ ] **Schemas** (`src/schemas/projects.ts`)
  - Zod schema for `CreateProjectRequest`
  - Validate project name (non-empty, max length)

- [ ] **Repository** (`src/repositories/ProjectRepository.ts`)
  - `create(userId, name, slug, description)`
  - `findByUserId(userId)`
  - `countByUserId(userId)`
  - `findById(projectId)`

- [ ] **Service** (`src/services/ProjectService.ts`)
  - `create(userId, name)`: Slugify name, create project
  - `getProjectsByUser(userId)`
  - Helper: `generateSlug(name)`

- [ ] **Controller** (`src/controllers/ProjectController.ts`)
  - `POST /api/projects` - Create project
  - `GET /api/projects` - List user's projects
  - `GET /api/projects/:id` - Get project by ID
  - Error handling

- [ ] **Routes** (`src/routes/projects.ts`)
  - Register endpoints with auth + quota middleware

### Tests (Vitest + Supertest)
- [ ] `src/__tests__/auth/signup.test.ts`
  - ✅ Valid signup returns 201 with user + token
  - ❌ Invalid email returns 400
  - ❌ Duplicate email returns 409

- [ ] `src/__tests__/auth/signin.test.ts`
  - ✅ Valid signin returns 200 with token
  - ❌ Wrong password returns 401
  - ❌ User not found returns 401

- [ ] `src/__tests__/projects/create.test.ts`
  - ✅ Create project within quota returns 201
  - ❌ Exceed quota returns 403 with `errors.quota_exceeded`
  - ❌ Unauthenticated returns 401

- [ ] `src/__tests__/projects/list.test.ts`
  - ✅ List user's projects returns 200
  - ✅ Empty list returns []

### Frontend Integration
- [ ] **API Client** (`web/src/api/client.ts`)
  - Axios instance with base URL
  - Interceptor to add JWT token to requests

- [ ] **Hooks** (`web/src/hooks/useAuth.ts`)
  - `useAuth()` hook to manage auth state
  - Store token in localStorage (with warning in ADR)
  - Methods: `signup()`, `signin()`, `logout()`

- [ ] **SignUp Component** (`web/src/components/SignUp.tsx`)
  - Form with email, password, confirm password
  - Call `useAuth().signup()`
  - Handle localized errors
  - Redirect to dashboard on success

- [ ] **Dashboard Component** (`web/src/components/Dashboard.tsx`)
  - Show user projects list
  - Create project form with quota feedback
  - Show plan and remaining quota

- [ ] **Tests** (`web/src/__tests__/auth.integration.test.tsx`)
  - Mock API responses
  - Full flow: signup → signin → view projects

## 📝 Important Notes

### Localization (i18n)
All error responses from API must use localization keys:
```json
{
  "error": {
    "key": "errors.invalid_email",
    "message": "Invalid email format"
  }
}
```

Frontend looks up the key in its i18n files:
```typescript
// en.json
{ "errors": { "invalid_email": "Invalid email format" } }

// es.json
{ "errors": { "invalid_email": "Formato de correo inválido" } }
```

### Password Security
- Minimum 8 characters
- Hash with bcrypt (cost: 10)
- Never store plain passwords

### JWT Token
- Payload: `{ userId, email, iat, exp }`
- Expiration: 24 hours (can be adjusted)
- Secret: `process.env.JWT_SECRET`

### Database Transactions
For operations that modify multiple tables (e.g., create user + insert initial subscription), use Knex transactions:
```typescript
await knex.transaction(async (trx) => {
  await trx('users').insert(userData);
  await trx('subscriptions').insert(subscriptionData);
});
```

## 🚀 Running Tier 1

```bash
# Start Docker stack
npm run docker:up

# Install dependencies if first time
npm install -w api
npm install -w web

# Run migrations + seeds
npm run db:setup -w api

# Run tests (watch mode)
npm run test:watch -w api

# Start dev servers
npm run dev:api &
npm run dev:web &

# Frontend at http://localhost:3000
# API at http://localhost:3001
# Test at http://localhost:3001/health
```

## 📊 Test Coverage Goals
- Auth: 90%+ coverage
- Projects: 85%+ coverage
- Middleware: 95%+ coverage

Run: `npm run test:coverage -w api`
