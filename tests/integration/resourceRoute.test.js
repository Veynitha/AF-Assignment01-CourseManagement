// resourceRoutes.test.js

const request = require('supertest');
const express = require('express');
const resourceRoutes = require('../../routes/resourceRoute');
const resourceController = require('../../controllers/resourceController');

// Mocking controller
jest.mock('../../controllers/resourceController', () => ({
  createResource: jest.fn(),
  updateResource: jest.fn(),
  deleteResource: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/api/resource', resourceRoutes);

describe('Resource Routes', () => {
  it('should create a new resource', async () => {
    const newResourceData = {
      name: 'Sample Resource',
      description: 'This is a sample resource',
      // Add more data as needed
    };

    resourceController.createResource.mockImplementation((req, res) => {
      // Assuming req.body contains the new resource data
      const createdResource = { id: 1, ...req.body }; // Mocking a newly created resource with an ID
      res.status(201).json({ message: 'Resource created successfully', resource: createdResource });
    });

    const res = await request(app)
      .post('/api/resource/create-resource')
      .send(newResourceData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Resource created successfully');
    expect(res.body).toHaveProperty('resource');
    expect(res.body.resource).toHaveProperty('id', 1);
    // Add more assertions if needed
  });

  it('should update an existing resource', async () => {
    const updatedResourceData = {
      name: 'Updated Resource Name',
      description: 'This is an updated description',
      // Add more updated data as needed
    };

    resourceController.updateResource.mockImplementation((req, res) => {
      // Assuming req.body contains the updated resource data
      res.status(200).json({ message: 'Resource updated successfully' });
    });

    const res = await request(app)
      .put('/api/resource/update-resource/1')
      .send(updatedResourceData);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Resource updated successfully');
    // Add more assertions if needed
  });

  // Write tests for other routes similarly
});
