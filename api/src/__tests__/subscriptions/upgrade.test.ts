import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../index.js';

describe('Subscriptions - Upgrade', () => {
  let token: string;
  let userId: number;
  let proPlanId: number;

  beforeAll(async () => {
    // Get Pro plan ID
    const plansResponse = await request(app).get('/api/plans');
    const proPlan = plansResponse.body.data.find((p: any) => p.code === 'pro');
    proPlanId = proPlan.id;

    // Create and signin test user
    const signupResponse = await request(app).post('/api/auth/signup').send({
      email: 'subscription-test@example.com',
      password: 'TestPassword123',
    });

    token = signupResponse.body.data.token;
    userId = signupResponse.body.data.userId;
  });

  it('should return 201 with successful upgrade', async () => {
    const response = await request(app)
      .post('/api/subscriptions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        planId: proPlanId,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('subscription');
    expect(response.body.data).toHaveProperty('user');
    expect(response.body.data.subscription.status).toBe('active');
  });

  it('should update user quota after upgrade', async () => {
    // Create new user
    const newUserResponse = await request(app).post('/api/auth/signup').send({
      email: 'quota-upgrade-test@example.com',
      password: 'TestPassword123',
    });

    const newToken = newUserResponse.body.data.token;

    // Get Pro plan
    const plansResponse = await request(app).get('/api/plans');
    const proPlan = plansResponse.body.data.find((p: any) => p.code === 'pro');

    // Upgrade
    const upgradeResponse = await request(app)
      .post('/api/subscriptions')
      .set('Authorization', `Bearer ${newToken}`)
      .send({
        planId: proPlan.id,
      });

    expect(upgradeResponse.body.data.user.projects_quota).toBe(10);
  });

  it('should return 401 without token', async () => {
    const response = await request(app).post('/api/subscriptions').send({
      planId: proPlanId,
    });

    expect(response.status).toBe(401);
  });

  it('should return 400 with invalid plan ID', async () => {
    const response = await request(app)
      .post('/api/subscriptions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        planId: 99999,
      });

    expect(response.status).toBe(400);
    expect(response.body.error.key).toBe('errors.plan_not_found');
  });

  it('should return 409 if already on plan', async () => {
    // Create new user
    const newUserResponse = await request(app).post('/api/auth/signup').send({
      email: 'already-on-plan-test@example.com',
      password: 'TestPassword123',
    });

    const newToken = newUserResponse.body.data.token;

    // Get Free plan (user is already on free)
    const plansResponse = await request(app).get('/api/plans');
    const freePlan = plansResponse.body.data.find((p: any) => p.code === 'free');

    // Try to upgrade to same plan
    const response = await request(app)
      .post('/api/subscriptions')
      .set('Authorization', `Bearer ${newToken}`)
      .send({
        planId: freePlan.id,
      });

    expect(response.status).toBe(409);
    expect(response.body.error.key).toBe('errors.already_on_plan');
  });
});
