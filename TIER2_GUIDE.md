# Tier 2: Plans & Subscriptions Implementation Guide

## 🎯 Objectives
- Implement Plans endpoint (GET /api/plans with i18n)
- Implement Subscriptions upgrade flow
- Implement mocked Stripe Adapter (Seam pattern)
- Invoice generation and quota updates
- End-to-end tests for subscription upgrade

## 🏗️ Architecture

### New Endpoints

```
GET /api/plans
  └─> PlanController.list()
      └─> PlanRepository.all()
          └─> Database (returns Free/Pro with localized names)

POST /api/subscriptions
  └─> SubscriptionController.create()
      └─> AuthMiddleware
      └─> SubscriptionService.upgrade()
          ├─> PaymentAdapter.createSubscription() [MOCKED STRIPE]
          ├─> SubscriptionRepository.create()
          ├─> InvoiceRepository.create()
          └─> UserRepository.updateQuota()
```

### Adapter Pattern (Stripe Seam)

```typescript
// Interface (contract)
interface IPaymentAdapter {
  createSubscription(userId: string, planId: string): Promise<PaymentResult>;
  cancelSubscription(subscriptionId: string): Promise<void>;
}

// Mock Implementation (for now)
class MockStripeAdapter implements IPaymentAdapter {
  async createSubscription(userId, planId) {
    // Simulate successful payment
    return { success: true, transactionId: 'mock-txn-123' };
  }
}

// Can be swapped later with real Stripe adapter
```

## 📋 Implementation Checklist

### Models & Schemas
- [ ] **Schemas** (`src/schemas/subscriptions.ts`)
  - Zod schema for `CreateSubscriptionRequest`
  - Must include: `planId` (number)

- [ ] **Types** (`src/types/index.ts`)
  - `Plan` interface (id, code, name_en, name_es, projects_quota, price)
  - `Subscription` interface (id, userId, planId, status, startedAt, expiresAt)
  - `Invoice` interface (id, userId, subscriptionId, invoiceNumber, amount, status)
  - `PaymentResult` interface (success, transactionId, error?)

### Repositories
- [ ] **PlanRepository** (`src/repositories/PlanRepository.ts`)
  - `all()`: Fetch all plans (Free, Pro)
  - `findById(planId)`
  - `findByCode(code)`

- [ ] **SubscriptionRepository** (`src/repositories/SubscriptionRepository.ts`)
  - `create(userId, planId, status)`: Insert subscription
  - `findByUserId(userId)`: Fetch active subscription
  - `findById(subscriptionId)`

- [ ] **InvoiceRepository** (`src/repositories/InvoiceRepository.ts`)
  - `create(userId, subscriptionId, amount, status)`: Insert invoice
  - `findBySubscriptionId(subscriptionId)`
  - Helper: `generateInvoiceNumber()` - Format: INV-YYYYMMDD-XXXX

### Adapters
- [ ] **IPaymentAdapter** (`src/adapters/IPaymentAdapter.ts`)
  - Abstract interface with `createSubscription()` and `cancelSubscription()`

- [ ] **MockStripeAdapter** (`src/adapters/MockStripeAdapter.ts`)
  - Implements IPaymentAdapter
  - Simulates successful payments
  - Returns mock transaction ID

- [ ] **Dependency Injection**
  - Pass adapter to services (inject via constructor or factory)
  - Can swap mock for real Stripe later

### Services
- [ ] **SubscriptionService** (`src/services/SubscriptionService.ts`)
  - `upgrade(userId, planId)`: Orchestrate upgrade flow
    - Fetch user and plan
    - Call payment adapter
    - If success:
      - Use Knex transaction to:
        - Create subscription record
        - Create invoice record
        - Update user's projects_quota
      - Return subscription object
    - If failure: Throw error with localized key `errors.payment_failed`
  - `getSubscription(userId)`
  - `cancel(subscriptionId)` [Optional for Tier 2]

### Controllers
- [ ] **PlanController** (`src/controllers/PlanController.ts`)
  - `GET /api/plans` - List all plans with localized names

- [ ] **SubscriptionController** (`src/controllers/SubscriptionController.ts`)
  - `POST /api/subscriptions` - Upgrade to plan
    - Requires auth
    - Returns: subscription object + updated user quota
    - Errors: 400 (invalid plan), 402 (payment failed), 409 (already subscribed)

### Routes
- [ ] **Routes** (`src/routes/subscriptions.ts`)
  - Register PlanController.list()
  - Register SubscriptionController.create() with auth middleware

### Tests
- [ ] `src/__tests__/plans/list.test.ts`
  - ✅ GET /api/plans returns 200 with Free + Pro plans
  - ✅ Plans contain localized names (name_en, name_es)
  - ✅ Pro plan has 10 projects_quota
  - ✅ Free plan has 3 projects_quota

- [ ] `src/__tests__/subscriptions/upgrade.test.ts`
  - ✅ Successful upgrade returns 201 subscription + updated quota
  - ✅ User's projects_quota changes from 3 to 10
  - ✅ Invoice is created with correct amount
  - ✅ Subscription status is "active"
  - ❌ Invalid plan ID returns 400
  - ❌ Payment adapter failure returns 402 with `errors.payment_failed`
  - ❌ Unauthenticated user returns 401

- [ ] `src/__tests__/invoices/create.test.ts`
  - ✅ Invoice generated with unique invoice number
  - ✅ Invoice amount matches plan price
  - ✅ Invoice linked to subscription and user

### Frontend (Tier 2 Extension)
- [ ] **PlansModal Component** (`web/src/components/PlansModal.tsx`)
  - Show Free vs Pro plans side-by-side
  - Display price, project quota, features
  - "Upgrade to Pro" button (disabled if already Pro)
  - Call subscription API on click

- [ ] **Hooks** (`web/src/hooks/useSubscription.ts`)
  - `useSubscription()` hook to manage subscription state
  - Methods: `upgradeToPro()`
  - Handle loading/error states

- [ ] **Tests** (`web/src/__tests__/plans.integration.test.tsx`)
  - Fetch and display plans
  - Mock subscription upgrade
  - Verify quota is updated

## 💳 Subscription Upgrade Flow

### Happy Path
```
User clicks "Upgrade to Pro"
  ↓
POST /api/subscriptions { planId: 2 }
  ↓
SubscriptionService.upgrade(userId, 2)
  ├─ Fetch user (current quota: 3)
  ├─ Fetch plan 2 (Pro: quota 10, price $29.99)
  ├─ Call MockStripeAdapter.createSubscription()
  │   └─ Returns { success: true, transactionId: 'mock-txn-123' }
  ├─ BEGIN TRANSACTION
  │   ├─ INSERT subscriptions (userId, planId=2, status='active')
  │   ├─ INSERT invoices (amount=29.99, status='pending')
  │   ├─ UPDATE users SET projects_quota=10 WHERE id=userId
  │   └─ COMMIT
  └─ Return { subscription, updatedUser }
      ↓
Response 201: { subscription, user: { ...quota: 10 } }
  ↓
Frontend updates state, shows success message
```

### Error Path
```
Payment fails
  ↓
MockStripeAdapter returns { success: false, error: 'Card declined' }
  ↓
SubscriptionService throws PaymentError
  ↓
SubscriptionController catches, returns 402
  ↓
Frontend shows localized error: "errors.payment_failed"
  ↓
User can retry
```

## 🔧 Configuration

### Payment Adapter Factory
```typescript
// src/adapters/PaymentAdapterFactory.ts
export function createPaymentAdapter(): IPaymentAdapter {
  if (process.env.PAYMENT_ADAPTER === 'stripe') {
    return new RealStripeAdapter();
  }
  return new MockStripeAdapter();
}

// Usage in SubscriptionService
const adapter = createPaymentAdapter();
```

### Database Transactions Example
```typescript
async upgrade(userId: string, planId: number) {
  try {
    const result = await this.db.transaction(async (trx) => {
      // All these are atomic
      const sub = await trx('subscriptions').insert({...});
      const inv = await trx('invoices').insert({...});
      await trx('users').where('id', userId).update({...});
      return { subscription: sub, invoice: inv };
    });
    return result;
  } catch (error) {
    throw new PaymentError('Upgrade failed');
  }
}
```

## 📝 Important Notes

### Invoice Numbering
- Format: `INV-20251024-0001`
- Must be unique
- Use database sequence or timestamp + random suffix

### Localization in DB
Plans table already has `name_en` and `name_es`:
```json
{
  "id": 1,
  "code": "free",
  "name_en": "Free",
  "name_es": "Gratis",
  "projects_quota": 3,
  "price": 0
}
```

Frontend can use these OR store its own translations (discuss in ADR).

### Mock Adapter Behavior
For Tier 2, mock adapter:
- Always succeeds (simulates successful payment)
- Returns transaction ID: `mock-stripe-{timestamp}`
- Log calls to console for debugging

Later (outside Tier 2):
- Replace with real Stripe SDK
- Handle actual payment processing
- Implement webhook handling for payment confirmations

## 🚀 Running Tier 2

```bash
# Ensure DB is up and migrations run
npm run docker:up
npm run db:setup -w api

# Run all tests
npm run test -w api

# Run specific test file
npm run test src/__tests__/subscriptions/upgrade.test.ts -w api

# Check coverage
npm run test:coverage -w api

# Dev servers
npm run dev:api &
npm run dev:web &
```

## ✅ Acceptance Criteria

- [ ] `GET /api/plans` returns localized plans
- [ ] `POST /api/subscriptions` upgrades user to Pro
- [ ] User quota updates from 3 to 10
- [ ] Invoice created with correct number format
- [ ] All tests passing with >85% coverage
- [ ] Frontend displays plans and upgrade button
- [ ] Error handling with localized messages
