// registerRoutes.test.js

const request = require('supertest');
const express = require('express');
const registerRoutes = require('../../routes/registerRouter');
const registerController = require('../../controllers/registerController');

// Mocking controller
jest.mock('../../controllers/registerController', () => ({
  registerStudent: jest.fn(),
  registerAdmin: jest.fn(),
  registerFaculty: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/api/register', registerRoutes);

describe('Register Routes', () => {
  it('should register a new student', async () => {
    const newStudentData = {
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password123',
      role: 'student'
    };

    registerController.registerStudent.mockImplementation((req, res) => {
      // Assuming req.body contains the new student data
      const registeredStudent = { id: 1, ...req.body }; // Mocking a newly registered student with an ID
      res.status(201).json({ message: 'Student registered successfully', student: registeredStudent });
    });

    const res = await request(app)
      .post('/api/register/student-registration')
      .send(newStudentData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Student registered successfully');
    expect(res.body).toHaveProperty('student');
    expect(res.body.student).toHaveProperty('id', 1);
    // Add more assertions if needed
  });

  // Write tests for other routes similarly
});
