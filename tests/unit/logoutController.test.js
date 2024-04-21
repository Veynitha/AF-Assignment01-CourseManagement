const Users = require('../../models/usersModel');
const { handleLogout } = require('../../controllers/logoutController');

jest.mock('../../models/usersModel');

describe('handleLogout', () => {
    it('should handle logout and clear cookie', async () => {
        const cookies = { jwt: 'fakeRefreshToken' };
        const req = { cookies };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            clearCookie: jest.fn()
        };
        const foundUser = { _id: '123456789' };
        Users.findOne.mockResolvedValueOnce(foundUser);
        Users.findByIdAndUpdate.mockResolvedValueOnce({});

        await handleLogout(req, res);

        expect(Users.findOne).toHaveBeenCalledWith({ refreshToken: cookies.jwt });
        expect(Users.findByIdAndUpdate).toHaveBeenCalledWith({ _id: foundUser._id }, { refreshToken: null }, { new: true });
        expect(res.clearCookie).toHaveBeenCalledWith('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "User logged out successfully" });
    });

    it('should handle no cookie present', async () => {
        const req = { cookies: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            clearCookie: jest.fn()
        };

        await handleLogout(req, res);

        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.json).toHaveBeenCalledWith({ message: "No cookie present" });
    });

    it('should handle no user found with token', async () => {
        const cookies = { jwt: 'fakeRefreshToken' };
        const req = { cookies };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            clearCookie: jest.fn()
        };
        Users.findOne.mockResolvedValueOnce(null);

        await handleLogout(req, res);

        expect(res.clearCookie).toHaveBeenCalledWith('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.json).toHaveBeenCalledWith({ message: "No user found with this token" });
    });

    it('should handle errors during logout', async () => {
        const cookies = { jwt: 'fakeRefreshToken' };
        const req = { cookies };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            clearCookie: jest.fn()
        };
        Users.findOne.mockRejectedValueOnce('Error');

        await handleLogout(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Something went wrong. Please try again." });
    });
});
