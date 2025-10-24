import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../index.js';

describe('Auth - Signup', () => {
  it('should return 201 and token with valid signup', async () => {
    const response = await request(app).post('/api/auth/signup').send({
      email: 'user@example.com',
      password: 'TestPassword123',
      locale: 'en',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('userId');
    expect(response.body.data).toHaveProperty('email');
    expect(response.body.data.email).toBe('user@example.com');
  });

  it('should return 400 with invalid email', async () => {
    const response = await request(app).post('/api/auth/signup').send({
      email: 'invalid-email',
      password: 'TestPassword123',
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error.key).toBe('errors.invalid_email');
  });

  it('should return 400 with short password', async () => {
    const response = await request(app).post('/api/auth/signup').send({
      email: 'user@example.com',
      password: 'Short1',
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 409 with duplicate email', async () => {
    const email = 'duplicate@example.com';

    // First signup
    await request(app).post('/api/auth/signup').send({
      email,
      password: 'TestPassword123',
    });

    // Second signup with same email
    const response = await request(app).post('/api/auth/signup').send({
      email,
      password: 'TestPassword123',
    });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error.key).toBe('errors.email_already_exists');
  });
});
