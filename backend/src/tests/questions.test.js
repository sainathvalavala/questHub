const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Question = require('../models/Question');

const TEST_MONGO_URI = 'mongodb://127.0.0.1:27017/quizz_test';

let userToken;
let otherUserToken;
let testQuestionId;

beforeAll(async () => {
  await mongoose.disconnect();
  await mongoose.connect(TEST_MONGO_URI);
});

afterAll(async () => {
  await User.deleteMany({});
  await Question.deleteMany({});
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Question.deleteMany({});

  // Register two users: user1 (will be admin since first user), user2 (standard user)
  const user1 = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'adminuser',
      email: 'admin@example.com',
      password: 'password123'
    });
  userToken = user1.body.token;

  const user2 = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'standarduser',
      email: 'standard@example.com',
      password: 'password123'
    });
  otherUserToken = user2.body.token;
});

describe('Question Endpoints', () => {
  const newQuestion = {
    title: 'How does photosynthesis work?',
    description: 'Looking for a detailed explanation of light-dependent reactions.',
    tags: 'Science, Biology'
  };

  describe('POST /api/questions', () => {
    it('should create a question and deduct 10 points from asker', async () => {
      const res = await request(app)
        .post('/api/questions')
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send(newQuestion);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('title', newQuestion.title);
      expect(res.body.tags).toContain('Science');
      expect(res.body.asker).toHaveProperty('username', 'standarduser');

      // Check points deducted (started with 100, should be 90)
      const user = await User.findOne({ username: 'standarduser' });
      expect(user.points).toEqual(90);
    });

    it('should deny question posting if user is not authorized', async () => {
      const res = await request(app)
        .post('/api/questions')
        .send(newQuestion);

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/questions', () => {
    beforeEach(async () => {
      // Create questions for feed tests
      const res = await request(app)
        .post('/api/questions')
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send(newQuestion);
      testQuestionId = res.body._id;
    });

    it('should fetch all questions', async () => {
      const res = await request(app).get('/api/questions');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('title', newQuestion.title);
    });

    it('should filter questions by tags', async () => {
      const res = await request(app)
        .get('/api/questions')
        .query({ tag: 'Science' });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(1);
    });
  });

  describe('DELETE /api/questions/:id', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post('/api/questions')
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send(newQuestion);
      testQuestionId = res.body._id;
    });

    it('should allow author to delete own question and refund 10 points', async () => {
      const deleteRes = await request(app)
        .delete(`/api/questions/${testQuestionId}`)
        .set('Authorization', `Bearer ${otherUserToken}`);

      expect(deleteRes.statusCode).toEqual(200);
      
      const user = await User.findOne({ username: 'standarduser' });
      expect(user.points).toEqual(100); // Refunded back to 100
    });

    it('should allow admin to delete user question', async () => {
      const deleteRes = await request(app)
        .delete(`/api/questions/${testQuestionId}`)
        .set('Authorization', `Bearer ${userToken}`); // Admin token

      expect(deleteRes.statusCode).toEqual(200);
    });
  });
});
