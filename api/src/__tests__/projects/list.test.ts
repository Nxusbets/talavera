import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../index.js';

describe('Projects - List', () => {
  let token: string;

  beforeAll(async () => {
    // Create and signin test user
    const signupResponse = await request(app).post('/api/auth/signup').send({
      email: 'project-lister@example.com',
      password: 'TestPassword123',
    });

    token = signupResponse.body.data.token;

    // Create some projects
    for (let i = 1; i <= 3; i++) {
      await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: `Project ${i}`,
        });
    }
  });

  it('should return 200 with list of projects', async () => {
    const response = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(3);
  });

  it('should return 200 with empty list for new user', async () => {
    // Create new user without projects
    const newUserResponse = await request(app).post('/api/auth/signup').send({
      email: 'empty-list@example.com',
      password: 'TestPassword123',
    });

    const newToken = newUserResponse.body.data.token;

    const response = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${newToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([]);
  });

  it('should return 401 without token', async () => {
    const response = await request(app).get('/api/projects');

    expect(response.status).toBe(401);
  });
});
