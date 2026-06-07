const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

const TEST_MONGO_URI = 'mongodb://127.0.0.1:27017/quizz_test';

beforeAll(async () => {
  // Disconnect from standard database and connect to test database
  await mongoose.disconnect();
  await mongoose.connect(TEST_MONGO_URI);
});

afterAll(async () => {
  // Clear the database and close the connection
  await User.deleteMany({});
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth Endpoints', () => {
  const mockUser = {
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'password123'
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(mockUser);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('username', 'testuser');
      expect(res.body.user).toHaveProperty('email', 'testuser@example.com');
      expect(res.body.user).toHaveProperty('role', 'admin'); // First user registers as admin
    });

    it('should fail registration with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'invaliduser',
          email: 'not-an-email',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });

    it('should prevent registration of duplicate emails', async () => {
      await request(app).post('/api/auth/register').send(mockUser);
      
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'anotherusername',
          email: mockUser.email,
          password: 'password123'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'User already exists with this email');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(mockUser);
    });

    it('should authenticate registered users', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: mockUser.email,
          password: mockUser.password
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should reject incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: mockUser.email,
          password: 'wrongpassword'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });
  });
});
