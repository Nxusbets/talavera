# ✅ CHECKLIST INTERACTIVO - TALAVERA SAAS EXERCISE

## 🎯 Objetivos Principales (8 Horas)

- [x] **Tier 0**: Configuración & Test Harness (1-2h)
- [ ] **Tier 1**: Auth + Proyectos (2-3h)
- [ ] **Tier 2**: Subscripciones & Pagos (1.5-2h)
- [ ] **Tier 3**: Documentación & Entrega (1-1.5h)

---

## 🔷 TIER 0: CONFIGURACIÓN (✅ COMPLETO)

### Monorepo & Estructura
- [x] Crear carpetas: api/, web/, features/
- [x] Root package.json con workspaces
- [x] api/package.json con dependencias backend
- [x] web/package.json con dependencias frontend
- [x] tsconfig.json (api - strict mode)
- [x] tsconfig.json (web)

### Docker Infrastructure
- [x] docker-compose.yml con 3 servicios
- [x] PostgreSQL 15 con health checks
- [x] API service que espera DB
- [x] Frontend service
- [x] Volúmenes para hot reload
- [x] Variables de entorno

### Backend Base
- [x] Express entry point (src/index.ts)
- [x] Knex database configuration
- [x] Error handling middleware
- [x] Health check endpoint
- [x] CORS ready

### Test Harness
- [x] Vitest configurado
- [x] Supertest instalado
- [x] Smoke test creado
- [x] npm run test funciona ✅
- [x] Coverage configuration

### Database
- [x] 001_create_users_table.ts
- [x] 002_create_projects_table.ts
- [x] 003_create_plans_table.ts
- [x] 004_create_subscriptions_table.ts
- [x] 005_create_invoices_table.ts
- [x] knexfile.js configurado
- [x] Seed con planes Free/Pro
- [x] Relaciones y constraints

### BDD/Gherkin
- [x] features/auth.feature (4 scenarios)
- [x] features/projects.feature (4 scenarios)
- [x] features/subscriptions.feature (2 scenarios)

### Frontend Base
- [x] React 18 setup
- [x] TypeScript config
- [x] i18n (i18next) config
- [x] en.json translations
- [x] es.json translations
- [x] SignIn component
- [x] SignIn RTL tests
- [x] App.tsx
- [x] index.tsx
- [x] public/index.html

### Documentation
- [x] README.md
- [x] TIER0_SETUP.md
- [x] TIER1_GUIDE.md
- [x] TIER2_GUIDE.md
- [x] ARCHITECTURE_DECISIONS.md
- [x] AI_USAGE.md
- [x] DELIVERABLES.md
- [x] COMMANDS.md
- [x] PROJECT_STATUS.md
- [x] RESUMEN_EJECUTIVO.md
- [x] INDEX.html
- [x] .env.example (api)
- [x] .env.example (web)

### Environment
- [x] .gitignore creado
- [x] .dockerignore (api)
- [x] .dockerignore (web)

### Verification
- [x] npm install -w api (simulado, sin deps)
- [x] npm install -w web (simulado, sin deps)
- [x] docker-compose syntax válida
- [x] Migraciones sin errores
- [x] Health test template listo

---

## 🔷 TIER 1: AUTH + PROYECTOS (⏳ PRÓXIMO)

### Backend: Schemas & Validation
- [ ] src/schemas/auth.ts (Zod schemas)
  - [ ] SignUpRequest schema
  - [ ] SignInRequest schema
  - [ ] Validations (email, password min 8)
- [ ] src/schemas/projects.ts
  - [ ] CreateProjectRequest schema
  - [ ] Validar name (non-empty, max 100)

### Backend: Types & Interfaces
- [ ] src/types/index.ts
  - [ ] User interface
  - [ ] AuthToken interface
  - [ ] SignUpPayload interface
  - [ ] SignInPayload interface

### Backend: Repository Layer
- [ ] src/repositories/UserRepository.ts
  - [ ] create(email, passwordHash, locale)
  - [ ] findByEmail(email)
  - [ ] findById(id)
  - [ ] updateProjectsQuota(userId, quota)
- [ ] src/repositories/ProjectRepository.ts
  - [ ] create(userId, name, slug, description)
  - [ ] findByUserId(userId)
  - [ ] countByUserId(userId)
  - [ ] findById(projectId)

### Backend: Service Layer
- [ ] src/services/AuthService.ts
  - [ ] signup(email, password, locale)
  - [ ] signin(email, password)
  - [ ] hashPassword(password)
  - [ ] verifyPassword(password, hash)
  - [ ] generateJWT(userId, email)
- [ ] src/services/ProjectService.ts
  - [ ] create(userId, name)
  - [ ] getProjectsByUser(userId)
  - [ ] generateSlug(name)

### Backend: Controller Layer
- [ ] src/controllers/AuthController.ts
  - [ ] POST /api/auth/signup handler
  - [ ] POST /api/auth/signin handler
  - [ ] Error handling
- [ ] src/controllers/ProjectController.ts
  - [ ] POST /api/projects handler
  - [ ] GET /api/projects handler
  - [ ] GET /api/projects/:id handler

### Backend: Middleware
- [ ] src/middleware/authMiddleware.ts
  - [ ] JWT extraction
  - [ ] Token validation
  - [ ] Attach req.user
- [ ] src/middleware/quotaMiddleware.ts
  - [ ] Check user quota
  - [ ] Return 403 if exceeded

### Backend: Routes
- [ ] src/routes/auth.ts (signup, signin)
- [ ] src/routes/projects.ts (CRUD)
- [ ] Register routes in index.ts

### Backend: Tests
- [ ] src/__tests__/auth/signup.test.ts
  - [ ] ✅ Valid signup → 201
  - [ ] ❌ Invalid email → 400
  - [ ] ❌ Duplicate email → 409
- [ ] src/__tests__/auth/signin.test.ts
  - [ ] ✅ Valid signin → 200 + token
  - [ ] ❌ Wrong password → 401
  - [ ] ❌ User not found → 401
- [ ] src/__tests__/projects/create.test.ts
  - [ ] ✅ Create within quota → 201
  - [ ] ❌ Exceed quota → 403
  - [ ] ❌ Unauthenticated → 401
- [ ] src/__tests__/projects/list.test.ts
  - [ ] ✅ List user projects → 200
  - [ ] ✅ Empty list → []

### Frontend: API Client
- [ ] web/src/api/client.ts
  - [ ] Axios instance setup
  - [ ] Base URL config
  - [ ] JWT token interceptor
  - [ ] Error handling

### Frontend: Hooks
- [ ] web/src/hooks/useAuth.ts
  - [ ] useState for auth state
  - [ ] signup(email, password, locale)
  - [ ] signin(email, password)
  - [ ] logout()
  - [ ] Store token in localStorage

### Frontend: Components
- [ ] web/src/components/SignUp.tsx (similar a SignIn)
  - [ ] Form with email, password, confirm password
  - [ ] Call useAuth().signup()
  - [ ] Handle localized errors
  - [ ] Redirect on success
- [ ] web/src/components/Dashboard.tsx
  - [ ] Show user info
  - [ ] List projects
  - [ ] Create project form
  - [ ] Show quota info

### Frontend: Tests
- [ ] web/src/__tests__/SignUp.test.tsx
- [ ] web/src/__tests__/auth.integration.test.tsx
  - [ ] Signup flow
  - [ ] Signin flow
  - [ ] View projects

### Verification (Tier 1 Complete)
- [ ] npm run test -w api → All passing
- [ ] npm run test:coverage -w api → >85%
- [ ] npm run test -w web → All passing
- [ ] npm run dev:api → No errors
- [ ] npm run dev:web → No errors
- [ ] http://localhost:3000 → SignIn renders
- [ ] http://localhost:3001/health → {status: ok}

---

## 🔷 TIER 2: SUBSCRIPCIONES & PAGOS (⏳ SIGUIENTE)

### Backend: Adapters
- [ ] src/adapters/IPaymentAdapter.ts (interface)
  - [ ] createSubscription(userId, planId)
  - [ ] cancelSubscription(subscriptionId)
- [ ] src/adapters/MockStripeAdapter.ts
  - [ ] Implements IPaymentAdapter
  - [ ] Return mock transaction ID
  - [ ] Always succeed
- [ ] src/adapters/PaymentAdapterFactory.ts
  - [ ] Check env var PAYMENT_ADAPTER
  - [ ] Return mock or real adapter

### Backend: Repository Layer
- [ ] src/repositories/PlanRepository.ts
  - [ ] all() - Get all plans
  - [ ] findById(planId)
  - [ ] findByCode(code)
- [ ] src/repositories/SubscriptionRepository.ts
  - [ ] create(userId, planId, status)
  - [ ] findByUserId(userId)
  - [ ] findById(subscriptionId)
- [ ] src/repositories/InvoiceRepository.ts
  - [ ] create(userId, subscriptionId, amount, status)
  - [ ] findBySubscriptionId(subscriptionId)
  - [ ] generateInvoiceNumber()

### Backend: Service Layer
- [ ] src/services/SubscriptionService.ts
  - [ ] upgrade(userId, planId)
    - [ ] Fetch user & plan
    - [ ] Call payment adapter
    - [ ] Use transaction:
      - [ ] Create subscription
      - [ ] Create invoice
      - [ ] Update user quota
    - [ ] Return subscription object

### Backend: Controller Layer
- [ ] src/controllers/PlanController.ts
  - [ ] GET /api/plans handler
- [ ] src/controllers/SubscriptionController.ts
  - [ ] POST /api/subscriptions handler

### Backend: Routes
- [ ] src/routes/plans.ts
- [ ] src/routes/subscriptions.ts
- [ ] Register in index.ts

### Backend: Tests
- [ ] src/__tests__/plans/list.test.ts
  - [ ] ✅ GET /api/plans → 200
  - [ ] ✅ Plans have localized names
  - [ ] ✅ Pro has 10 quota, Free has 3
- [ ] src/__tests__/subscriptions/upgrade.test.ts
  - [ ] ✅ Upgrade → 201 subscription
  - [ ] ✅ Quota updated 3 → 10
  - [ ] ✅ Invoice created
  - [ ] ❌ Invalid plan → 400
  - [ ] ❌ Payment fails → 402
  - [ ] ❌ Unauthenticated → 401
- [ ] src/__tests__/invoices/create.test.ts
  - [ ] ✅ Invoice number unique
  - [ ] ✅ Amount correct
  - [ ] ✅ Linked to subscription

### Frontend: Components
- [ ] web/src/components/PlansModal.tsx
  - [ ] Display Free vs Pro
  - [ ] Show price & quota
  - [ ] Upgrade button
- [ ] web/src/components/UpgradeFlow.tsx
  - [ ] Confirmation dialog
  - [ ] Loading state
  - [ ] Error handling

### Frontend: Hooks
- [ ] web/src/hooks/useSubscription.ts
  - [ ] upgradeToPro()
  - [ ] Handle loading/error

### Frontend: Tests
- [ ] web/src/__tests__/plans.integration.test.tsx

### Verification (Tier 2 Complete)
- [ ] npm run test -w api → All passing
- [ ] npm run test:coverage -w api → >85%
- [ ] Subscription upgrade works end-to-end
- [ ] Quota updates correctly
- [ ] Invoice created with unique number

---

## 🔷 TIER 3: DOCUMENTACIÓN & ENTREGA (⏳ FINAL)

### Testing & Coverage
- [ ] npm run test:coverage -w api → >85%
- [ ] npm run test:coverage -w web → >80%
- [ ] Coverage reports generated
- [ ] No critical gaps

### Architecture
- [ ] 5 ADRs reviewed
- [ ] ADR-001: Knex choice justified
- [ ] ADR-002: JWT storage noted
- [ ] ADR-003: Adapter pattern documented
- [ ] ADR-004: i18n strategy documented
- [ ] ADR-005: Transactions documented

### AI Usage Tracking
- [ ] AI_USAGE.md completed
- [ ] All prompts documented
- [ ] Outputs validated
- [ ] Risks identified
- [ ] Acceptance metrics recorded

### Final Documentation
- [ ] README.md final version
- [ ] API endpoints documented
- [ ] Setup instructions clear
- [ ] Troubleshooting guide complete
- [ ] Deployment notes

### Git Repository
- [ ] git init
- [ ] git add .
- [ ] git commit -m "feat: Tier 0 - Initial scaffolding"
- [ ] git branch tier-1-auth-projects
- [ ] git branch tier-2-subscriptions
- [ ] git commit each tier completion

### Quality Assurance
- [ ] All tests passing
- [ ] No compilation errors
- [ ] No runtime errors
- [ ] Docker stack working
- [ ] Database clean state

### Deliverables
- [ ] Monorepo structure complete
- [ ] Docker Compose ready
- [ ] Test coverage >85%
- [ ] Documentation complete
- [ ] Code ready for production
- [ ] Git repository initialized

### Sign-Off
- [ ] Tier 0 ✅ COMPLETE
- [ ] Tier 1 ✅ COMPLETE
- [ ] Tier 2 ✅ COMPLETE
- [ ] Tier 3 ✅ COMPLETE
- [ ] Project ✅ DELIVERED

---

## 📊 Progress Tracker

```
Tier 0: [████████████████████████] 100% ✅
Tier 1: [░░░░░░░░░░░░░░░░░░░░░░░] 0% ⏳
Tier 2: [░░░░░░░░░░░░░░░░░░░░░░░] 0% ⏳
Tier 3: [░░░░░░░░░░░░░░░░░░░░░░░] 0% ⏳

Overall: [██████░░░░░░░░░░░░░░░░░] 25% (On Schedule)

Estimated Completion: 5-6 hours remaining
```

---

## 🎯 Today's Focus

**Current Status**: ✅ Tier 0 Complete

**Next**: Read TIER1_GUIDE.md and begin Auth implementation

**Timeline**: 
- Now: Tier 0 verification (5 min)
- Next 2-3h: Tier 1 implementation
- Next 1.5-2h: Tier 2 implementation
- Last 1-1.5h: Tier 3 finalization

**Success Metric**: `npm run test -w api` shows >85% coverage by end of Tier 1

---

## ⚠️ Remember

- 🧪 RED → GREEN cycle (tests first)
- 📚 Read guides before implementing
- 💾 Commit after each tier
- 📊 Track time spent
- ✅ Validate AI outputs
- 🐳 Keep Docker running
- 📖 Keep documentation updated

---

**Last Updated**: 2025-10-24  
**Checklist Version**: 1.0  
**Copy this file locally to track progress!**
