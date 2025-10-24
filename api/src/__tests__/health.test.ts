import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../index';

describe('Health Check (Smoke Test)', () => {
  it('should return 200 and ok status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('should have required headers', async () => {
    const response = await request(app).get('/health');
    expect(response.headers['content-type']).toContain('application/json');
  });
});
