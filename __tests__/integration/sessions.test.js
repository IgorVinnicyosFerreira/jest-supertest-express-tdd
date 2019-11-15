const request = require('supertest');
const app = require('../../src/app');
const factory = require('../factories');
const truncate = require('../utils/truncate');

describe('Authentication', () => {
  beforeEach(async () => {
    await truncate();
  });
  it('should be athenticate with valid credentials', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: user.password
      });

    expect(response.status).toBe(200);
  });

  it('should not athenticate with invalid credentials', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '12333333'
      });

    expect(response.status).toBe(401);
  });

  it('should not authenticate with nonexistent email', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'joaozinho@1231.com',
        password: user.password
      });

    expect(response.status).toBe(401);
  });

  it('should return jwt token when authenticated', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: user.password
      });

    expect(response.body).toHaveProperty('token');
  });

  it('should be able to access private routes when authenticated', async () => {
    const user = await factory.create('User');

    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it('should not be able to access private routes when not authenticated', async () => {
    const response = await request(app).get('/dashboard');

    expect(response.status).toBe(403);
  });

  it('should not be able to access private routes with invalid jwt token', async () => {
    const response = await request(app)
      .get('/dashboard')
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      );

    expect(response.status).toBe(403);
  });
});
