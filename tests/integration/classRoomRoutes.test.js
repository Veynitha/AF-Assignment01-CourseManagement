// classRoomRoutes.test.js

const request = require('supertest');
const express = require('express');
const classRoomRoutes = require('../../routes/classRoomRoute'); // Adjust path as per your project structure
const classRoomController = require('../../controllers/classRoomController'); // Adjust path as per your project structure
const verifyRoles = require('../../middlewares/verifyRoles'); // Adjust path as per your project structure

// Mocking controller
jest.mock('../../controllers/classRoomController', () => ({
  createClassRoom: jest.fn(),
  getAllClassRooms: jest.fn(),
  getClassRoomById: jest.fn(),
  updateClassRoom: jest.fn()
}));

// Mocking verifyRoles middleware
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
app.use('/api/classroom', classRoomRoutes);

describe('Class Room Routes', () => {
  it('should create a new class room', async () => {
    // Mock implementation of createClassRoom controller function
    classRoomController.createClassRoom.mockImplementation((req, res) => {
      const createdClassRoom = { id: 1, ...req.body }; // Mocking a newly created class room with an ID
      res.status(201).json({ message: 'Class room created successfully', classRoom: createdClassRoom });
    });

    // Send request to create a new class room
    const res = await request(app)
      .post('/api/classroom/create-classroom')
      .send({ name: 'Physics', capacity: 30 });

    // Assertions for the response
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Class room created successfully');
    expect(res.body).toHaveProperty('classRoom');
    expect(res.body.classRoom).toHaveProperty('id', 1);
    // Add more assertions if needed
  });

  it('should get all class rooms', async () => {
    const classRooms = [
      { id: 1, name: 'Physics', capacity: 30 },
      { id: 2, name: 'Chemistry', capacity: 25 }
      // Add more class room data as needed
    ];

    // Mock implementation of getAllClassRooms controller function
    classRoomController.getAllClassRooms.mockImplementation((req, res) => {
      res.status(200).json({ classRooms });
    });

    // Send request to get all class rooms
    const res = await request(app)
      .get('/api/classroom/get-classrooms');

    // Assertions for the response
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('classRooms', classRooms);
    // Add more assertions if needed
  });

  // Write tests for other routes similarly
});
