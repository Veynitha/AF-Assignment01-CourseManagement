const Notification = require('../../models/notificationModel');
const Faculty = require('../../models/facultyModel');
const { createNotification } = require('../../controllers/notificationController');

jest.mock('../../models/notificationModel');
jest.mock('../../models/facultyModel');

describe('createNotification', () => {
    it('should create a new notification', async () => {
        const req = {
            body: {
                facultyId: '123456789',
                message: 'Test notification message'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const newNotificationData = { facultyId: req.body.facultyId, message: req.body.message };
        const notificationInstance = { save: jest.fn().mockResolvedValueOnce('notificationCreated') }; 
        Notification.mockReturnValueOnce(notificationInstance); 
    
        await createNotification(req, res);
    
        expect(Notification).toHaveBeenCalledWith(newNotificationData);
        expect(notificationInstance.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ data: { notificationCreated: 'notificationCreated' }, message: "Notification Created Successfully." });
    });

    it('should handle errors while creating a notification', async () => {
        const req = {
            body: {
                facultyId: '123456789',
                message: 'Test notification message'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        Notification.mockReturnValueOnce({
            save: jest.fn().mockRejectedValueOnce('Error')
        });

        await createNotification(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ data: {}, message: "Error Creating Notification." });
    });
});
