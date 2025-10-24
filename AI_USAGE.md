# AI_USAGE.md - AI-Assisted Development Tracking

## 📋 Overview
This document tracks AI usage throughout the 8-hour Talavera SaaS exercise, including:
- Prompts and AI outputs per tier
- Validations and changes made
- Risks identified and mitigations
- Code acceptance/rejection decisions

---

## 🔷 Tier 0: Configuration & Test Harness (Hour 0-2)

### Key Prompts to AI

1. **Prompt**: "Generate monorepo structure with backend/frontend and Docker Compose setup"
   - **AI Output**: ✅ Accepted as-is
   - **Result**: `package.json` workspace config, `docker-compose.yml`, directory structure
   - **Changes**: None

2. **Prompt**: "Create Vitest configuration and initial smoke test with Supertest"
   - **AI Output**: ✅ Accepted with minor adjustments
   - **Changes**: Removed `type Config` import (resolved on `npm install`)
   - **Result**: `vitest.config.ts` and `health.test.ts` working

3. **Prompt**: "Generate Gherkin features for auth, projects, and subscriptions"
   - **AI Output**: ✅ Accepted with feedback
   - **Changes**: Clarified scenario naming (use "user attempts" vs "user fails" for consistency)
   - **Result**: Three `.feature` files with realistic BDD scenarios

4. **Prompt**: "Create Knex migrations for users, projects, plans, subscriptions, invoices"
   - **AI Output**: ✅ Accepted
   - **Changes**: None
   - **Result**: Five migration files with proper relationships and indexes

5. **Prompt**: "Generate Express entry point and database connection module"
   - **AI Output**: ✅ Accepted
   - **Changes**: Added proper error handling middleware
   - **Result**: `src/index.ts` and `src/db.ts` ready for implementation

### Risks Identified & Mitigated

| Risk | Severity | Description | Mitigation |
|------|----------|-------------|-----------|
| TypeScript errors before `npm install` | Low | Type definitions missing for packages | Expected; resolves after dependency installation |
| Docker Compose health check | Medium | DB readiness check might be flaky | Implemented explicit `healthcheck` with retries |
| Vitest configuration | Low | Import path for `vitest/config` | Verified after package install |
| JWT_SECRET hardcoded in docker-compose | High | Development secret exposed | ⚠️ NOTED: Must use strong secret + env vars in production (see ADR) |

### Accepted AI Outputs Summary
- ✅ 5/5 major scaffolding pieces
- ✅ 3/3 Gherkin feature files
- ✅ 5/5 database migrations
- ✅ 100% acceptance rate for Tier 0

---

## 🔷 Tier 1: Auth + Projects (Hour 2-5)

### Key Prompts to AI (Planned)

**Prompt 1**: "Generate Zod schemas for auth endpoints (signup, signin)"
- Expected AI Output: Validation schemas with email + password
- Acceptance Criteria:
  - Email must be valid format
  - Password minimum 8 characters
  - Error messages mapped to i18n keys

**Prompt 2**: "Create auth service with bcrypt hashing and JWT generation"
- Expected AI Output: AuthService with signup(), signin(), helper methods
- Acceptance Criteria:
  - Passwords hashed with bcrypt (cost 10)
  - JWT includes userId + email
  - Error handling with localized keys

**Prompt 3**: "Generate UserRepository with create() and findByEmail()"
- Expected AI Output: Database layer for user operations
- Acceptance Criteria:
  - Uses Knex query builder
  - Proper error handling
  - Transaction support

**Prompt 4**: "Create auth controller with error handling and localization"
- Expected AI Output: Express controller for POST /api/auth/signup and POST /api/auth/signin
- Acceptance Criteria:
  - Validates input with Zod schema
  - Returns standardized error responses with i18n keys
  - Status codes: 201 (created), 400 (bad request), 401 (unauthorized), 409 (conflict)

**Prompt 5**: "Generate ProjectService with quota checking logic"
- Expected AI Output: Service that validates project creation against user quota
- Acceptance Criteria:
  - Counts existing projects
  - Compares to plan quota
  - Returns 403 if exceeded with `errors.quota_exceeded` key

**Prompt 6**: "Create React SignIn component with form validation and i18n"
- Expected AI Output: Already created in Tier 0
- Status: ✅ Component ready, tests pending

### Validation Strategy for Tier 1
1. Run `npm run test -w api` after each service/controller addition
2. Verify tests transition from RED → GREEN
3. Check i18n keys are used consistently
4. Validate frontend component integrates with API

---

## 🔷 Tier 2: Plans & Subscriptions (Hour 5-7)

### Key Prompts to AI (Planned)

**Prompt 1**: "Design payment adapter interface (Seam pattern) for Stripe"
- Expected AI Output: IPaymentAdapter interface with createSubscription()
- Acceptance Criteria:
  - Clean abstraction for payment provider
  - Can be mocked for testing
  - Can be swapped for real Stripe later

**Prompt 2**: "Create mock Stripe adapter implementation"
- Expected AI Output: MockStripeAdapter that simulates successful payments
- Acceptance Criteria:
  - Implements IPaymentAdapter
  - Returns mock transaction IDs
  - Suitable for local testing

**Prompt 3**: "Generate subscription service with transaction handling"
- Expected AI Output: SubscriptionService.upgrade() orchestrating full flow
- Acceptance Criteria:
  - Uses Knex transaction for atomicity
  - Updates user quota on success
  - Creates invoice record
  - Handles payment failures gracefully

**Prompt 4**: "Create invoice generation logic with unique numbering"
- Expected AI Output: InvoiceRepository.create() with formatted invoice numbers
- Acceptance Criteria:
  - Format: `INV-YYYYMMDD-XXXX`
  - Unique constraint in database
  - Proper error handling on collision

---

## 🔷 Tier 3: Documentation & Finalization (Hour 7-8)

### Outputs (This Document & Others)

**AI_USAGE.md** (this file)
- ✅ Created with template structure
- Documents: Accepted AI outputs, changes, risks, mitigations

**ADR (Architecture Decision Record)**
- Planned: 2-3 ADRs for key decisions
- Topics: Knex vs Prisma, JWT storage, payment adapter pattern

**Coverage Script & Delivery**
- Planned: `npm run test:coverage` command
- Include: HTML report generation

---

## 📊 AI Acceptance Metrics

### Tier 0 Final Stats
| Metric | Value |
|--------|-------|
| AI Prompts | 5 major |
| Outputs Accepted | 5/5 (100%) |
| Outputs Partially Accepted | 0/5 |
| Outputs Rejected | 0/5 |
| Files Generated | 25+ |
| Lines of Code (Scaffolding) | ~800 |

### Expected Tier 1 Stats (TBD)
| Metric | Target |
|--------|--------|
| AI Prompts | 6-8 |
| Acceptance Rate | >90% |
| Test Coverage | >85% |

---

## 🚨 High-Priority Risks Documented

### 1. JWT Token Storage (Tier 1+)
**Risk**: Storing JWT in `localStorage` is vulnerable to XSS attacks.
**Current Status**: Frontend uses localStorage (TEMPORARY FOR DEMO)
**Mitigation**:
- Document this limitation in code comments
- ADR to justify choice
- In production: Use HTTP-only cookies + CSRF tokens
- Consider: React Context + secure storage for sensitive apps

### 2. Password Storage (Tier 1)
**Risk**: Plaintext passwords in logs
**Mitigation**:
- Bcrypt hashing at service layer
- Remove passwords from error logs
- Use `PASSWORD_REDACTED` in logging

### 3. Payment Adapter Coupling (Tier 2)
**Risk**: Real Stripe calls in test environment
**Mitigation**:
- MockStripeAdapter used by default
- `PAYMENT_ADAPTER` env var to switch
- All tests use mocks
- Cannot call real Stripe without explicit flag

### 4. N+1 Query Problem (Tier 1+)
**Risk**: Listing projects could make N queries for user quotas
**Mitigation**:
- Cache user quota in request context
- Use JOIN queries when fetching projects with user data
- Monitor with test assertions

### 5. Concurrency Issues (Tier 2)
**Risk**: Two simultaneous subscription upgrades
**Mitigation**:
- Use database transactions (Knex transaction)
- Add unique constraint on (user_id, active_subscription)
- Test with concurrent requests

---

## ✅ Sign-Off Checklist

### Tier 0 Completion
- [x] All scaffolding files created
- [x] Docker stack configured
- [x] Test harness working (`npm run test` passes)
- [x] Gherkin features written
- [x] Database migrations ready
- [x] Development documentation created

### Tier 1 Readiness
- [ ] All auth tests passing (RED → GREEN)
- [ ] All project CRUD tests passing
- [ ] Frontend integrated with API
- [ ] i18n working in frontend errors

### Tier 2 Readiness
- [ ] All subscription tests passing
- [ ] Mock payment adapter working
- [ ] Invoice generation verified
- [ ] End-to-end tests passing

### Final Delivery (Hour 8)
- [ ] All tests passing with coverage reports
- [ ] ADRs written and reviewed
- [ ] AI_USAGE.md completed
- [ ] README with setup instructions
- [ ] Git repository initialized and pushed

---

## 📝 Notes for Future Phases

### Post-Tier 2 Enhancements
- Real Stripe integration (replace MockStripeAdapter)
- Webhook handling for payment confirmations
- Subscription renewal logic
- Plan downgrades
- Usage analytics

### Technical Debt to Track
- [ ] i18n key standardization (all errors use `errors.*` pattern)
- [ ] Error response schema consistency
- [ ] Test database cleanup between tests
- [ ] API rate limiting
- [ ] Request validation middleware

---

**Last Updated**: 2025-10-24
**Document Version**: 1.0
**Tier Status**: ✅ Tier 0 Complete | ⏳ Tier 1 In Progress | ⏳ Tier 2 Planned | ⏳ Tier 3 Planned
