const request = require('supertest');
const express = require('express');
const notificationRoutes = require('../../routes/notificationRoute');
const notificationController = require('../../controllers/notificationController');

// Mocking controller
jest.mock('../../controllers/notificationController', () => ({
  createNotification: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/api/notification', notificationRoutes);

describe('Notification Routes', () => {
  it('should create a new notification', async () => {
    const newNotificationData = {
      title: 'New Notification',
      message: 'This is a test notification'
    };

    notificationController.createNotification.mockImplementation((req, res) => {
      const createdNotification = { id: 1, ...req.body }; // Mocking a newly created notification with an ID
      res.status(201).json({ message: 'Notification created successfully', notification: createdNotification });
    });

    const res = await request(app)
      .post('/api/notification/create-notification')
      .send(newNotificationData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Notification created successfully');
    expect(res.body).toHaveProperty('notification');
    expect(res.body.notification).toHaveProperty('id', 1);
  });
});
