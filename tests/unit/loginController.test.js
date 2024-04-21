const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { handleLogin } = require('../../controllers/loginController');
const User = require('../../models/usersModel');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('dotenv');
jest.mock('../../models/usersModel');

describe('handleLogin', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should handle login and return access token', async () => {
        const req = {
            body: {
                email: 'test@example.com',
                password: 'password123'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn()
        };
        const foundUser = {
            _id: '123456789',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: 'user'
        };
        User.findOne.mockResolvedValueOnce(foundUser);
        bcrypt.compare.mockResolvedValueOnce(true);
        jwt.sign.mockImplementationOnce((payload, secret, options) => {
            if (options.expiresIn === '300s') {
                return 'fakeAccessToken';
            }
            return 'fakeRefreshToken';
        });
        User.findByIdAndUpdate.mockResolvedValueOnce(foundUser);

        await handleLogin(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
        expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, foundUser.password);
        expect(jwt.sign).toHaveBeenCalledTimes(2);
        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
            { _id: foundUser._id },
            { refreshToken: undefined },
            { new: true }
        );
        expect(res.cookie).toHaveBeenCalledWith('jwt', undefined, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        expect(res.json).toHaveBeenCalledWith({ accessToken: 'fakeAccessToken' });
    });

    it('should handle missing email or password', async () => {
        const req = {
            body: {}
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn()
        };

        await handleLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Username and password are required." });
    });

    it('should handle user not found', async () => {
        const req = {
            body: {
                email: 'nonexistent@example.com',
                password: 'password123'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn()
        };
        User.findOne.mockResolvedValueOnce(null);

        await handleLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "User does not exist!" });
    });

    it('should handle errors during login', async () => {
        const req = {
            body: {
                email: 'test@example.com',
                password: 'password123'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn()
        };
        User.findOne.mockRejectedValueOnce('Error');

        await handleLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith("Something went wrong. Please try again.");
    });
});
