const bcrypt = require('bcrypt');
const {
  registerStudent,
  registerAdmin,
  registerFaculty,
} = require('../../controllers/registerController');
const User = require('../../models/usersModel');
const Student = require('../../models/studentModel');
const Admin = require('../../models/adminModel');
const Faculty = require('../../models/facultyModel');
const TimeTable = require('../../models/timeTableModel');

jest.mock('bcrypt');
jest.mock('../../models/usersModel');
jest.mock('../../models/studentModel');
jest.mock('../../models/adminModel');
jest.mock('../../models/facultyModel');
jest.mock('../../models/timeTableModel');

describe('registerStudent', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test Student',
        faculty: 'facultyId',
      },
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  test('should return 400 if email or password is missing', async () => {
    req.body.email = '';
    await registerStudent(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email and password are required.' });
  });

  test('should return 400 if user already exists', async () => {
    User.findOne.mockResolvedValue({ email: 'test@example.com' });
    await registerStudent(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ data: {}, message: 'User already exists.' });
  });

  test('should return 400 if faculty does not exist', async () => {
    User.findOne.mockResolvedValue(null);
    Faculty.findById.mockResolvedValue(null);
    await registerStudent(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ data: {}, message: 'Faculty does not exist.' });
  });

  test('should create user and student successfully', async () => {
    User.findOne.mockResolvedValue(null);
    Faculty.findById.mockResolvedValue({});
    bcrypt.hash.mockResolvedValue('hashedPassword');
    User.prototype.save.mockResolvedValue({});
    Student.prototype.save.mockResolvedValue({});
    await registerStudent(req, res);
    expect(User.prototype.save).toHaveBeenCalled();
    expect(Student.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      data: expect.any(Object),
      message: 'User Created Successfully!',
    });
  });
});

describe('registerAdmin', () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          name: 'Test Admin',
        },
      };
      res = {
        status: jest.fn(() => res),
        sendStatus: jest.fn(),
        json: jest.fn(),
      };
    });
  
    test('should return 400 if email or password is missing', async () => {
      req.body.email = '';
      await registerAdmin(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email and password are required.' });
    });
  
    test('should return 409 if admin already exists', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com' });
      await registerAdmin(req, res);
      expect(res.sendStatus).toHaveBeenCalledWith(409);
    });
  
    test('should create user and admin successfully', async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.prototype.save.mockResolvedValue({});
      Admin.prototype.save.mockResolvedValue({});
      await registerAdmin(req, res);
      expect(User.prototype.save).toHaveBeenCalled();
      expect(Admin.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        data: expect.any(Object),
        message: 'User Created Successfully!',
      });
    });
  
  });

  describe('registerFaculty', () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          name: 'Test Faculty',
        },
      };
      res = {
        status: jest.fn(() => res),
        sendStatus: jest.fn(),
        json: jest.fn(),
      };
    });
  
    test('should return 400 if email or password is missing', async () => {
      req.body.email = '';
      await registerFaculty(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email and password are required.' });
    });
  
    test('should create user, faculty, and timetable successfully', async () => {
      User.findOne.mockResolvedValue(null);
      Faculty.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.prototype.save.mockResolvedValue({});
      Faculty.prototype.save.mockResolvedValue({});
      TimeTable.prototype.save.mockResolvedValue({});
      await registerFaculty(req, res);
      expect(User.prototype.save).toHaveBeenCalled();
      expect(Faculty.prototype.save).toHaveBeenCalled();
      expect(TimeTable.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        data: expect.any(Object),
        message: 'User Created Successfully!',
      });
    });
  });
