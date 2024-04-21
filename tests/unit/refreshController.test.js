const jwt = require('jsonwebtoken');
const { handleRefreshToken } = require('../../controllers/refreshController');
const Users = require('../../models/usersModel');

jest.mock('../../models/usersModel', () => ({
  findOne: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
  sign: jest.fn(),
}));

describe('handleRefreshToken', () => {
  let req, res;

  beforeEach(() => {
    req = {
      cookies: {},
    };
    res = {
      sendStatus: jest.fn(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 401 if jwt cookie is not present', async () => {
    await handleRefreshToken(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });

  test('should return 403 if user not found', async () => {
    req.cookies.jwt = 'someJwtToken';
    Users.findOne.mockResolvedValue(null);
    await handleRefreshToken(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  test('should return 403 if jwt verification fails', async () => {
    req.cookies.jwt = 'someJwtToken';
    const foundUser = { refreshToken: 'someRefreshToken', username: 'someUsername' };
    Users.findOne.mockResolvedValue(foundUser);
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Verification failed'));
    });
    await handleRefreshToken(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });

  test('should return access token if jwt verification succeeds', async () => {
    req.cookies.jwt = 'someJwtToken';
    const foundUser = { refreshToken: 'someRefreshToken', username: 'someUsername', role: 'someRole' };
    Users.findOne.mockResolvedValue(foundUser);
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { username: 'someUsername', email: 'some@example.com' });
    });
    jwt.sign.mockReturnValue('someAccessToken');
    await handleRefreshToken(req, res);
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        UserInfo: {
          email: 'some@example.com',
          role: 'someRole',
        },
      },
      expect.any(String), // process.env.ACCESS_TOKEN_SECRET
      { expiresIn: '300s' }
    );
    expect(res.json).toHaveBeenCalledWith({ accessToken: 'someAccessToken' });
  });
});
