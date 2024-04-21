// authRoutes.test.js

const request = require('supertest');
const express = require('express');
const authRoutes = require('../../routes/authRoutes');

// Mocking controllers
jest.mock('../../controllers/loginController', () => ({
  handleLogin: jest.fn((req, res) => res.status(200).json({ message: 'Login successful' }))
}));
jest.mock('../../controllers/refreshController', () => ({
  handleRefreshToken: jest.fn((req, res) => res.status(200).json({ message: 'Token refreshed' }))
}));
jest.mock('../../controllers/logoutController', () => ({
  handleLogout: jest.fn((req, res) => res.status(200).json({ message: 'Logout successful' }))
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Authentication Routes', () => {
  it('should handle login request', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
  });

  it('should handle token refresh request', async () => {
    const res = await request(app)
      .post('/api/auth/token')
      .send({ refreshToken: 'valid_refresh_token' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Token refreshed');
  });

  it('should handle logout request', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken: 'valid_refresh_token' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Logout successful');
  });
});
