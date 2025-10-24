import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../index.js';

describe('Plans - List', () => {
  it('should return 200 with list of plans', async () => {
    const response = await request(app).get('/api/plans');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it('should have Free plan with 3 quota', async () => {
    const response = await request(app).get('/api/plans');

    const freePlan = response.body.data.find(
      (p: any) => p.code === 'free'
    );
    expect(freePlan).toBeDefined();
    expect(freePlan.projects_quota).toBe(3);
    expect(freePlan.price).toBe(0);
  });

  it('should have Pro plan with 10 quota', async () => {
    const response = await request(app).get('/api/plans');

    const proPlan = response.body.data.find(
      (p: any) => p.code === 'pro'
    );
    expect(proPlan).toBeDefined();
    expect(proPlan.projects_quota).toBe(10);
    expect(proPlan.price).toBe(29.99);
  });

  it('should have localized plan names', async () => {
    const response = await request(app).get('/api/plans');

    expect(response.body.data[0]).toHaveProperty('name_en');
    expect(response.body.data[0]).toHaveProperty('name_es');
  });
});
