const { createSession, updateSession, deleteSession } = require('../../controllers/sessionController');
const Session = require('../../models/sessionModel');
const Faculty = require('../../models/facultyModel');
const TimeTable = require('../../models/timeTableModel');
const Notification = require('../../models/notificationModel');
const Course = require('../../models/courseModel');
const ClassRoom = require('../../models/classRoomModel');

jest.mock('../../models/sessionModel');
jest.mock('../../models/facultyModel');
jest.mock('../../models/timeTableModel');
jest.mock('../../models/notificationModel');
jest.mock('../../models/courseModel');
jest.mock('../../models/classRoomModel');

describe('createSession', () => {
    it('should create a session', async () => {
        // Mock request body
        const req = {
            body: {
                startTime: "2024-03-25T10:00:00.000Z",
                stopTime: "2024-03-25T12:00:00.000Z",
                location: 'locationId',
                course: 'courseId',
                type: 'type'
            }
        };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Expected response data
        const expectedResponse = {
            session: {}, // Your expected session data here
            timeTable: {} // Your expected notification data here
        };

        // Mocking session find result
        Session.find.mockResolvedValue([]);

        // Mocking session save result
        Session.prototype.save.mockResolvedValue({});

        // Mocking faculty find result
        Faculty.findOne.mockResolvedValue({ _id: 'facultyId' });

        // Mocking time table find result
        TimeTable.findOne.mockResolvedValue({ _id: 'timeTableId', sessions: [] });

        // Mocking time table update result
        TimeTable.findByIdAndUpdate.mockResolvedValue({});

        // Call the function
        await createSession(req, res);

        // Assertion
        expect(Session.find).toHaveBeenCalled();
        expect(Session.prototype.save).toHaveBeenCalled();
        expect(Faculty.findOne).toHaveBeenCalled();
        expect(TimeTable.findOne).toHaveBeenCalled();
        expect(TimeTable.findByIdAndUpdate).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ data: expectedResponse, message: "Session Created Successfully!" });
    });

    it('should handle error when session overlaps with existing sessions', async () => {
        const req = {
            body: {
                startTime: "2024-03-25T10:00:00.000Z",
                stopTime: "2024-03-25T12:00:00.000Z",
                location: 'locationId',
                course: 'courseId',
                date: '2024-03-24',
                type: 'type',
                name: 'John Doe'
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock existing sessions
        const existingSessions = [{}, {}]; // Mocking existing overlapping sessions
        Session.find.mockResolvedValue(existingSessions);

        await createSession(req, res);

        // Assertions
        expect(Session.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Session overlaps with existing session(s) at the same location and/or course!" });
    });

    it('should handle error when creating session and updating timeTable fails', async () => {
        const req = {
            body: {
                startTime: '08:00',
                stopTime: '10:00',
                location: 'locationId',
                course: 'courseId',
                date: '2024-03-24',
                type: 'type',
                name: 'John Doe'
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock existing sessions
        Session.find.mockResolvedValue([]);

        const faculty = { _id: 'facultyId' }; // Mocked faculty data
        Faculty.findOne.mockResolvedValue(faculty);

        // Mock time table data
        const timeTable = { _id: 'timeTableId' }; // Mocked time table data
        TimeTable.findOne.mockResolvedValue(timeTable);

        // Mock session save to throw an error
        Session.prototype.save.mockRejectedValue(new Error("Error saving session"));

        await createSession(req, res);

        // Assertions
        expect(Session.prototype.save).toHaveBeenCalled();
        expect(TimeTable.findByIdAndUpdate).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ data: {}, message: "Error Creating Session." });
    });
});

describe('updateSession', () => {
    it('should update a session', async () => {
        // Mock request parameters and body
        const req = {
            params: { id: 'sessionId' },
            body: {
                startTime: "2024-03-25T10:00:00.000Z",
                stopTime: "2024-03-25T12:00:00.000Z",
                location: 'locationId',
                course: 'courseId',
                type: 'type'
            }
        };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock existing session find result
        Session.find.mockResolvedValue([]);

        // Mock updated session result
        const updatedSession = { /* Mocked updated session data */ };
        Session.findByIdAndUpdate.mockResolvedValue(updatedSession);

        // Mock course find result
        const changedCourse = { _id: 'courseId', name: 'Course Name', faculty: 'facultyId' };
        Course.findById.mockResolvedValue(changedCourse);

        // Call the function
        await updateSession(req, res);

        // Assertions
        expect(Session.find).toHaveBeenCalled();
        expect(Session.findByIdAndUpdate).toHaveBeenCalledWith('sessionId', {
            startTime: new Date("2024-03-25T10:00:00.000Z"),
            stopTime: new Date("2024-03-25T12:00:00.000Z"),
            location: 'locationId',
            course: 'courseId',
            type: 'type'
        }, { new: true });
        expect(Course.findById).toHaveBeenCalledWith('courseId');
        expect(Notification).toHaveBeenCalledWith({
            facultyId: 'facultyId',
            message: 'The Session for Course Course Name has been updated. Please Refer your timetable for more details.',
            type: "faculty"
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: { session: updatedSession }, message: "Session Updated Successfully!" });
    });
    it('should handle error when session overlaps with existing sessions', async () => {
        const req = {
            params: { id: 'sessionId' },
            body: {
                startTime: '08:00',
                stopTime: '10:00',
                location: 'locationId',
                course: 'courseId',
                date: '2024-03-24',
                type: 'type'
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock existing sessions
        const existingSessions = [{}, {}]; // Mocking existing overlapping sessions
        Session.find.mockResolvedValue(existingSessions);

        await updateSession(req, res);

        // Assertions
        expect(Session.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Session overlaps with existing session(s) at the same location and/or course!" });
    });

    it('should handle error when updated session is not found', async () => {
        const req = {
            params: { id: 'invalidSessionId' },
            body: {
                startTime: "2024-03-25T10:00:00.000Z",
                stopTime: "2024-03-25T12:00:00.000Z",
                location: 'locationId',
                course: 'courseId',
                type: 'type'
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock existing sessions
        Session.find.mockResolvedValue([]);

        // Mock Session.findByIdAndUpdate to return null, indicating session not found
        Session.findByIdAndUpdate.mockResolvedValue(null);

        await updateSession(req, res);

        // Assertions
        expect(Session.findByIdAndUpdate).toHaveBeenCalledWith('invalidSessionId', {
            startTime: new Date("2024-03-25T10:00:00.000Z"),
            stopTime: new Date("2024-03-25T12:00:00.000Z"),
            location: 'locationId',
            course: 'courseId',
            type: 'type'
        }, { new: true });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({"data": {}, "message": "Error Updating Session."});
    });
});

describe('deleteSession', () => {
    it('should delete a session', async () => {
        // Mock request parameters
        const req = {
            params: { id: 'sessionId' }
        };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock deleted session result
        const deletedSession = { /* Mocked deleted session data */ };
        Session.findByIdAndDelete.mockResolvedValue(deletedSession);

        // Mock time table find and update result
        const timeTable = { sessions: ['sessionId'] };
        TimeTable.findOneAndUpdate.mockResolvedValue(timeTable);

        // Call the function
        await deleteSession(req, res);

        // Assertions
        expect(Session.findByIdAndDelete).toHaveBeenCalledWith("sessionId");
        expect(TimeTable.findOneAndUpdate).toHaveBeenCalledWith({ sessions: undefined }, {
            $pull: { sessions: undefined }
        }, { new: true });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: { session: deletedSession, timeTable }, message: "Session Deleted Successfully!" });
    });

    it('should handle error when session cannot be found and deleted', async () => {
        const req = {
            params: { id: 'invalidSessionId' }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Mock Session.findByIdAndDelete to return null, indicating session not found
        Session.findByIdAndDelete.mockResolvedValue(null);

        await deleteSession(req, res);

        // Assertions
        expect(Session.findByIdAndDelete).toHaveBeenCalledWith('invalidSessionId');
        expect(TimeTable.findOneAndUpdate).toHaveBeenCalledWith({ sessions: undefined }, {
            $pull: { sessions: undefined }
        }, { new: true });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith("Error Deleting Session.");
    });

    it('should handle error when timeTable update fails', async () => {
        const req = {
            params: { id: 'sessionId' }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const deletedSession = { /* Mocked deleted session data */ };
        Session.findByIdAndDelete.mockResolvedValue(deletedSession);

        // Mock TimeTable.findOneAndUpdate to return null, indicating update failure
        TimeTable.findOneAndUpdate.mockResolvedValue(null);

        await deleteSession(req, res);

        // Assertions
        expect(Session.findByIdAndDelete).toHaveBeenCalledWith('sessionId');
        expect(TimeTable.findOneAndUpdate).toHaveBeenCalledWith({ sessions: undefined }, {
            $pull: { sessions: undefined }
        }, { new: true });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith("Error Deleting Session.");
    });
});
