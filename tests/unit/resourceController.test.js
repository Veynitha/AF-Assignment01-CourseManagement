const { createResource, updateResource } = require('../../controllers/resourceController');
const Resource = require('../../models/resourceModel');
const ClassRoom = require('../../models/classRoomModel');

jest.mock('../../models/resourceModel');
jest.mock('../../models/classRoomModel');
const findByIdAndUpdateMock = jest.fn(() => mockResource);
Resource.findByIdAndUpdate.mockImplementation(findByIdAndUpdateMock);


describe('createResource', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        description: 'Test description',
      },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  test('should create resource successfully', async () => {
    const newResource = { _id: 'resourceId', description: 'Test description', location: '' };
    Resource.prototype.save.mockResolvedValue(newResource);
    await createResource(req, res);
    expect(Resource.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ data: newResource, Message: 'Resource Created Successfully!' });
  });

  test('should handle error while creating resource', async () => {
    const error = new Error('Database error');
    Resource.prototype.save.mockRejectedValue(error);
    await createResource(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ data: {}, message: 'Error Creating Resource.' });
  });
});

describe('updateResource', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 'resourceId' },
      body: {
        description: 'Updated description',
        location: 'classRoomId',
      },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

//   test('should update resource successfully', async () => {
//     const classRoomWithResource = { resources: ['resourceId'] };
//     const classRoomToBeUpdated = { _id: 'classRoomId', resources: [] };
//     const updatedResource = { _id: 'resourceId', description: 'Updated description', location: 'classRoomId' };
//     ClassRoom.findOne.mockResolvedValue(classRoomWithResource);
//     ClassRoom.findById.mockResolvedValue(classRoomToBeUpdated);
//     Resource.findByIdAndUpdate.mockResolvedValue(updatedResource);
//     await updateResource(req, res);
//     expect(ClassRoom.findOne).toHaveBeenCalled();
//     expect(ClassRoom.findById).toHaveBeenCalled();
//     expect(Resource.findByIdAndUpdate).toHaveBeenCalled();
//     expect(res.status).toHaveBeenCalledWith(201);
//     expect(res.json).toHaveBeenCalledWith({
//       data: { resource: updatedResource, classRoom: classRoomToBeUpdated },
//       message: 'Resource Updated Successfully!',
//     });
//   });

  test('should handle error while updating resource', async () => {
    const error = new Error('Database error');
    Resource.findByIdAndUpdate.mockRejectedValue(error);
    await updateResource(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ data: {}, message: 'Error Updating Resource.' });
  });
});
