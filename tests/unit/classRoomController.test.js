const Classroom = require('../../models/classRoomModel');
const {
    createClassRoom,
    getAllClassRooms,
    getClassRoomById,
    updateClassRoom
} = require('../../controllers/classRoomController');

describe('Classroom Controller', () => {
    describe('createClassRoom', () => {
        it('should create a new classroom', async () => {
            const req = {
                body: {
                    name: 'Math Class'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Classroom.prototype.save = jest.fn().mockResolvedValueOnce({
                _id: '123',
                name: 'Math Class',
                resources: [],
                allocation: []
            });

            await createClassRoom(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                data: {
                    _id: '123',
                    name: 'Math Class',
                    resources: [],
                    allocation: []
                },
                message: 'ClassRoom Created Successfully!'
            });
        });

        it('should handle errors while creating a classroom', async () => {
            const req = {
                body: {
                    name: 'Math Class'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Classroom.prototype.save = jest.fn().mockRejectedValueOnce(new Error('Database error'));

            await createClassRoom(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith('Error Creating ClassRoom.');
        });
    });

    describe('getAllClassRooms', () => {
        it('should get all classrooms', async () => {
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Classroom.find = jest.fn().mockResolvedValueOnce([
                {
                    _id: '123',
                    name: 'Math Class',
                    resources: [],
                    allocation: []
                },
                {
                    _id: '456',
                    name: 'Science Class',
                    resources: [],
                    allocation: []
                }
            ]);

            await getAllClassRooms({}, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                data: [
                    {
                        _id: '123',
                        name: 'Math Class',
                        resources: [],
                        allocation: []
                    },
                    {
                        _id: '456',
                        name: 'Science Class',
                        resources: [],
                        allocation: []
                    }
                ],
                message: 'ClassRooms Retreived Successfully!'
            });
        });

        it('should handle errors while getting all classrooms', async () => {
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Classroom.find = jest.fn().mockRejectedValueOnce(new Error('Database error'));

            await getAllClassRooms({}, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith('Error Retreiving ClassRooms.');
        });
    });

    describe('getClassRoomById', () => {
        it('should get a classroom by id', async () => {
            const req = {
                params: {
                    id: '123'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Classroom.findById = jest.fn().mockResolvedValueOnce({
                _id: '123',
                name: 'Math Class',
                resources: [],
                allocation: []
            });

            await getClassRoomById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                data: {
                    _id: '123',
                    name: 'Math Class',
                    resources: [],
                    allocation: []
                },
                message: 'ClassRoom Retreived Successfully!'
            });
        });

        it('should handle errors while getting a classroom by id', async () => {
            const req = {
                params: {
                    id: '123'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Classroom.findById = jest.fn().mockRejectedValueOnce(new Error('Database error'));

            await getClassRoomById(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith('Error Retreiving ClassRoom.');
        });
    });

    describe('updateClassRoom', () => {
        it('should update a classroom successfully', async () => {
            const req = {
                params: {
                    id: '123'
                },
                body: {
                    name: 'Updated Math Class'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Classroom.findById = jest.fn().mockResolvedValueOnce({
                _id: '123',
                name: 'Math Class',
                resources: [],
                allocation: []
            });
            Classroom.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({
                _id: '123',
                name: 'Updated Math Class',
                resources: [],
                allocation: []
            });

            await updateClassRoom(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                data: {
                    _id: '123',
                    name: 'Updated Math Class',
                    resources: [],
                    allocation: []
                },
                message: 'ClassRoom Updated Successfully!'
            });
        });

        it('should handle errors while updating a classroom', async () => {
            const req = {
                params: {
                    id: '123'
                },
                body: {
                    name: 'Updated Math Class'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Classroom.findById = jest.fn().mockResolvedValueOnce({
                _id: '123',
                name: 'Math Class',
                resources: [],
                allocation: []
            });
            Classroom.findByIdAndUpdate = jest.fn().mockRejectedValueOnce(new Error('Database error'));

            await updateClassRoom(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith('Error Updating ClassRoom.');
        });
    });
});


