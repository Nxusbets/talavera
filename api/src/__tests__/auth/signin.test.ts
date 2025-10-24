import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../index.js';

describe('Auth - Signin', () => {
  const testUser = {
    email: 'signin-test@example.com',
    password: 'TestPassword123',
  };

  beforeAll(async () => {
    // Create test user
    await request(app).post('/api/auth/signup').send(testUser);
  });

  it('should return 200 and token with valid signin', async () => {
    const response = await request(app).post('/api/auth/signin').send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data.email).toBe(testUser.email);
  });

  it('should return 401 with wrong password', async () => {
    const response = await request(app).post('/api/auth/signin').send({
      email: testUser.email,
      password: 'WrongPassword123',
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error.key).toBe('errors.invalid_credentials');
  });

  it('should return 401 with non-existent user', async () => {
    const response = await request(app).post('/api/auth/signin').send({
      email: 'nonexistent@example.com',
      password: 'TestPassword123',
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error.key).toBe('errors.invalid_credentials');
  });

  it('should return 400 with invalid email', async () => {
    const response = await request(app).post('/api/auth/signin').send({
      email: 'invalid-email',
      password: 'TestPassword123',
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
