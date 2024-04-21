// courseRoutes.test.js

const request = require('supertest');
const express = require('express');
const courseRoutes = require('../../routes/courseRoutes'); // Adjust path to match your project structure
const courseController = require('../../controllers/courseController'); // Adjust path to match your project structure
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Mocking controller
jest.mock('../../controllers/courseController', () => ({
  createCourse: jest.fn(),
  getAllCourses: jest.fn(),
  getCourseById: jest.fn(),
  assignFacultyToCourse: jest.fn(),
  getStudentsOfCourse: jest.fn(),
  updateCourse: jest.fn(),
  deleteCourse: jest.fn()
}));

// Mocking JWT middleware
jest.mock('../../middlewares/verifyJWT', () => (req, res, next) => {
  // Mocking a successful JWT verification
  req.email = 'test@example.com'; // Mocking email extracted from JWT payload
  req.role = 'admin'; // Mocking role extracted from JWT payload
  next();
});

// Mocking JWT middleware
jest.mock('../../middlewares/verifyRoles', () => {
  return jest.fn((...allowedRoles) => {
    return (req, res, next) => {
      // Mocking a successful role verification
      req.role = 'admin'; // Mocking role to match the required role for this test
      next();
    };
  });
});

const app = express();
app.use(express.json());
app.use('/api/course', courseRoutes);

describe('Course Routes', () => {
  it('should create a new course', async () => {
    const newCourseData = {
      name: 'Mathematics',
      faculty: 'Dr. Smith',
      students: ['Alice', 'Bob', 'Charlie']
    };

    // Mock implementation of createCourse controller function
    courseController.createCourse.mockImplementation((req, res) => {
      // Assuming req.body contains the new course data
      const createdCourse = { id: 1, ...req.body }; // Mocking a newly created course with an ID
      res.status(401).json({ message: 'Course created successfully', course: createdCourse });
    });

    // Send request to create a new course
    const res = await request(app)
      .post('/api/course/create-course')
      .send(newCourseData);

    // Assertions for the response
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message', 'Course created successfully');
    expect(res.body).toHaveProperty('course');
    expect(res.body.course).toHaveProperty('id', 1);
    // Add more assertions if needed
  });

  it('should get all courses', async () => {
    const courses = [
      { id: 1, name: 'Mathematics' },
      { id: 2, name: 'Physics' }
      // Add more course data as needed
    ];

    // Mock implementation of getAllCourses controller function
    courseController.getAllCourses.mockImplementation((req, res) => {
      res.status(200).json({ courses });
    });

    // Send request to get all courses
    const res = await request(app)
      .get('/api/course/get-courses');

    // Assertions for the response
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('courses', courses);
    // Add more assertions if needed
  });

  // Write tests for other routes similarly
});
