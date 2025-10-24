import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../index.js';

describe('Projects - Create', () => {
  let token: string;
  let userId: number;

  beforeAll(async () => {
    // Create and signin test user
    const signupResponse = await request(app).post('/api/auth/signup').send({
      email: 'project-creator@example.com',
      password: 'TestPassword123',
    });

    token = signupResponse.body.data.token;
    userId = signupResponse.body.data.userId;
  });

  it('should return 201 with valid project creation', async () => {
    const response = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'My First Project',
        description: 'A test project',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.name).toBe('My First Project');
    expect(response.body.data.slug).toBe('my-first-project');
    expect(response.body.data.user_id).toBe(userId);
  });

  it('should return 401 without token', async () => {
    const response = await request(app).post('/api/projects').send({
      name: 'Another Project',
    });

    expect(response.status).toBe(401);
  });

  it('should return 400 with missing project name', async () => {
    const response = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'No name provided',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 403 when quota exceeded', async () => {
    // Create user with free plan (3 projects quota)
    const newUserResponse = await request(app).post('/api/auth/signup').send({
      email: 'quota-test@example.com',
      password: 'TestPassword123',
    });

    const newToken = newUserResponse.body.data.token;

    // Create 3 projects (quota limit)
    for (let i = 1; i <= 3; i++) {
      await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${newToken}`)
        .send({
          name: `Project ${i}`,
        });
    }

    // Try to create 4th project (should fail)
    const response = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${newToken}`)
      .send({
        name: 'Project 4',
      });

    expect(response.status).toBe(403);
    expect(response.body.error.key).toBe('errors.quota_exceeded');
  });
});
