# Architecture Decision Records (ADRs)

## ADR-001: ORM Choice - Knex vs Prisma

### Status
ACCEPTED (Tier 0)

### Context
The project requires database migrations, seeding, and transaction support for a SaaS backend. Two main options:
1. **Knex.js**: Query builder with migration system, more control, manual query building
2. **Prisma**: ORM with schema file, migrations, type generation, higher abstraction

### Decision
**Chosen: Knex.js**

### Rationale
1. **Migration Control**: Knex migrations are plain JavaScript/TypeScript, easier to understand and debug
2. **Learning**: Full SQL control; no "magic" ORM behavior
3. **Performance**: Query builder is lightweight; no N+1 query surprises
4. **Transaction Handling**: Explicit transaction management important for subscription upgrades
5. **Development Speed**: Schema-first approach in Knex (write migrations) vs Prisma (write schema)
6. **Exercise Scope**: 8-hour exercise benefits from transparent tooling

### Tradeoffs
- **Advantage Prisma**: Type-safe queries, auto-generated client
- **Advantage Knex**: Lower abstraction, more control for learning
- **Chosen for this exercise**: Knex

### Implementation
- Knex migrations in `api/migrations/`
- Explicit transaction handling in services
- TypeScript types defined separately (not auto-generated)

### Future Consideration
If project scales, could migrate to Prisma later with:
- Prisma schema generated from Knex migrations
- Gradual replacement of queries
- Better IDE integration at that point

---

## ADR-002: JWT Storage - localStorage vs HTTP-Only Cookies

### Status
ACCEPTED WITH WARNING (Tier 1)

### Context
React frontend needs to store JWT token after login. Options:
1. **localStorage**: Simple, accessible from JavaScript
2. **HTTP-Only Cookies**: Secure, inaccessible to JavaScript (XSS protection)
3. **Memory + Refresh Token**: Complex, requires refresh flow
4. **React Context**: No persistence, good for sessions

### Decision
**Chosen: localStorage (SHORT-TERM) with HTTP-Only Cookie (RECOMMENDED)**

### Current Implementation (Tier 0-2)
Using `localStorage` for:
- Rapid development and testing
- Full control over token lifecycle
- Easier debugging during exercise
- Works well with mock API responses

### Security Concern ⚠️
**XSS Vulnerability**: If attacker injects JavaScript, they can steal tokens from localStorage.

### Mitigation (Current)
1. Use Content Security Policy (CSP) headers to prevent XSS
2. Sanitize all user input
3. Document this as a known limitation

### Recommended for Production
```typescript
// Pseudo-code: HTTP-Only Cookie approach
// Backend sets cookie on login
res.cookie('jwt', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000
});

// Frontend makes requests automatically (cookies sent)
// No JavaScript access to token
// CSRF token required for mutations
```

### Rationale for Current Choice
1. **Time Constraint**: HTTP-Only + CSRF tokens more complex
2. **Testing**: localStorage easier to manipulate in tests
3. **Learning**: Understand token flow before security hardening
4. **MVP**: localStorage acceptable for prototype

### Transition Plan
1. Tier 0-2: Use localStorage
2. Post-Tier 2: Implement HTTP-Only cookies
3. Documentation: Include security note in code

---

## ADR-003: Payment Adapter Pattern - Seam Model

### Status
ACCEPTED (Tier 2)

### Context
Project needs subscription handling with payment processing. Options:
1. **Direct Stripe Integration**: Tightly coupled, hard to test
2. **Adapter/Seam Pattern**: Decoupled, mockable, swappable
3. **Decorator Pattern**: Adds complexity, less clear

### Decision
**Chosen: Adapter Pattern (Seam Model)**

### Implementation

```typescript
// src/adapters/IPaymentAdapter.ts
interface IPaymentAdapter {
  createSubscription(userId: string, planId: string): Promise<PaymentResult>;
  cancelSubscription(subscriptionId: string): Promise<void>;
}

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// Mock for development/testing
class MockStripeAdapter implements IPaymentAdapter {
  async createSubscription(userId, planId) {
    return { success: true, transactionId: `mock-${Date.now()}` };
  }
}

// Real implementation later
class RealStripeAdapter implements IPaymentAdapter {
  async createSubscription(userId, planId) {
    // Call Stripe API
  }
}

// Dependency injection in service
class SubscriptionService {
  constructor(private paymentAdapter: IPaymentAdapter) {}
  
  async upgrade(userId, planId) {
    const result = await this.paymentAdapter.createSubscription(userId, planId);
    // ... rest of logic
  }
}
```

### Rationale
1. **Testability**: Mock adapter for unit tests
2. **Flexibility**: Swap implementations without changing service code
3. **Decoupling**: SubscriptionService doesn't know about Stripe details
4. **Evolution**: Easy to upgrade from mock → real Stripe

### Benefits
- All tests use MockStripeAdapter
- No external API calls in CI/CD
- Clear contract via interface
- Can have multiple implementations (e.g., PayPal adapter later)

### Risks Mitigated
- Real Stripe calls in test environment: ✅ Prevented by mock
- Accidental charges: ✅ Mock returns success without charging
- API key exposure: ✅ No real keys in test code

### Configuration
```typescript
// Factory function
function createPaymentAdapter(): IPaymentAdapter {
  if (process.env.USE_REAL_STRIPE === 'true') {
    return new RealStripeAdapter(process.env.STRIPE_SECRET_KEY);
  }
  return new MockStripeAdapter();
}
```

### Future Enhancement
Post-Tier 2: Implement real Stripe adapter with:
- Webhook handling for payment confirmations
- Retry logic for failed payments
- Idempotency keys to prevent duplicate charges
- Error recovery with fallback

---

## ADR-004: Localization Strategy - Frontend vs Backend i18n

### Status
ACCEPTED (Tier 1+)

### Context
Error messages, plan names, and UI text need localization (EN + ES). Options:
1. **Backend Decides**: API returns `errors.invalid_email` key, frontend looks up
2. **Backend Localizes**: API returns "Invalid email format" in user's language
3. **Frontend Client**: All i18n in React, backend returns keys
4. **Hybrid**: Backend for domain logic, frontend for UI

### Decision
**Chosen: Hybrid Approach**

### Implementation

**Backend**:
- Database stores localization keys: `name_en`, `name_es`
- Plans table has both languages
- Error responses include i18n key: `"error": { "key": "errors.invalid_email" }`

```typescript
// API Response
{
  "error": {
    "key": "errors.invalid_email",
    "message": "Invalid email format"
  }
}
```

**Frontend**:
- React component uses i18n to look up key
- Falls back to message if key not found

```typescript
const displayError = (response) => {
  const key = response.error.key;
  const localizedMessage = t(key); // Look up in i18n
  return localizedMessage || response.error.message;
};
```

### Rationale
1. **Flexibility**: Backend agnostic to language
2. **Client-Side Control**: Frontend chooses language
3. **Fallback**: Message from backend if i18n missing
4. **Scalability**: Easy to add new languages in frontend only

### Tradeoffs
- **Advantage Backend i18n**: Consistent across clients (mobile, web)
- **Advantage Frontend i18n**: Lightweight API responses
- **Chosen**: Hybrid (best of both)

### Implementation in Code

**Backend Error Response**:
```typescript
// AuthService.ts
if (!user) {
  throw new AuthError('Invalid credentials', 'errors.invalid_credentials');
}

// AuthController.ts
catch (error) {
  res.status(401).json({
    error: {
      key: error.i18nKey,
      message: error.message
    }
  });
}
```

**Frontend Usage**:
```typescript
// SignIn.tsx
catch (error) {
  const key = error.response.data.error.key;
  setGeneralError(t(key)); // Uses i18next
}
```

---

## ADR-005: Database Transaction Strategy - Atomicity for Subscriptions

### Status
ACCEPTED (Tier 2)

### Context
Subscription upgrade involves multiple tables:
1. Create subscription record
2. Create invoice record
3. Update user quota

If step 2 fails after step 1, data is inconsistent. Options:
1. **Transactions**: All or nothing
2. **Saga Pattern**: Complex, for distributed systems
3. **Idempotency**: Retry with same data
4. **No Protection**: Accept inconsistency (bad)

### Decision
**Chosen: Knex Transactions with Try-Catch**

### Implementation

```typescript
// SubscriptionService.ts
async upgrade(userId: string, planId: string) {
  const result = await this.db.transaction(async (trx) => {
    // All these queries use same transaction
    const subscription = await trx('subscriptions')
      .insert({ user_id: userId, plan_id: planId, status: 'active' });
    
    const invoice = await trx('invoices')
      .insert({ user_id: userId, subscription_id: subscription.id, amount: 29.99 });
    
    await trx('users')
      .where('id', userId)
      .update({ projects_quota: 10 });
    
    return { subscription, invoice };
  });
  
  return result;
  // If any step fails, entire transaction rolls back
}
```

### Rationale
1. **Atomicity**: All 3 operations succeed or all fail
2. **Data Consistency**: No partial upgrades
3. **Simplicity**: Knex provides transaction API
4. **PostgreSQL Support**: Native ACID guarantees

### Risks Mitigated
- Orphaned subscriptions: ✅ Transaction ensures all records created
- Quota desync: ✅ Fails if quota update fails
- Duplicate invoices: ✅ Wrapped in transaction

### Monitoring
Add logging around transaction:
```typescript
console.log(`[Subscription] Starting upgrade for user ${userId}`);
try {
  const result = await this.db.transaction(async (trx) => {
    // ...
  });
  console.log(`[Subscription] Upgrade successful for user ${userId}`);
  return result;
} catch (error) {
  console.error(`[Subscription] Upgrade failed for user ${userId}`, error);
  throw new PaymentError('Upgrade failed');
}
```

### Future Enhancement
- Implement retry logic for transient failures
- Add observability via tracing (e.g., Jaeger)
- Consider saga pattern if multi-service later

---

## Summary Table

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | Knex over Prisma | ✅ ACCEPTED |
| ADR-002 | localStorage → HTTP-Only | ⚠️ TEMPORARY |
| ADR-003 | Adapter Pattern for Payments | ✅ ACCEPTED |
| ADR-004 | Hybrid i18n (Backend + Frontend) | ✅ ACCEPTED |
| ADR-005 | DB Transactions for Subscriptions | ✅ ACCEPTED |

---

**Document Version**: 1.0
**Last Updated**: 2025-10-24
**Review Status**: Ready for implementation
