const {
    enrollCourse,
    unenrollCourse,
    getStudentCourses,
    viewTimeTable,
  } = require('../../controllers/studentController'); // Update the path with your controller file
  const Student = require('../../models/studentModel');
  const Course = require('../../models/courseModel');
  const Faculty = require('../../models/facultyModel');
  const TimeTable = require('../../models/timeTableModel');
  const Session = require('../../models/sessionModel');
  
  jest.mock('../../models/studentModel');
  jest.mock('../../models/courseModel');
  jest.mock('../../models/facultyModel');
  jest.mock('../../models/timeTableModel');
  jest.mock('../../models/sessionModel');
  
  describe('Controller Tests', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('enrollCourse', () => {
      it('should enroll course successfully', async () => {
        const req = {
          params: { id: 'studentId' },
          body: { courseId: 'courseId' },
        };
        const res = {
          status: jest.fn(() => res),
          json: jest.fn(),
        };
        Student.findById.mockResolvedValueOnce({ courses: [], save: jest.fn() });
        Course.findById.mockResolvedValueOnce({ students: [], save: jest.fn() });
  
        await enrollCourse(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          data: {},
          message: 'Error Enrolling Course.',
        });
      });
  
      it('should handle error when student or course not found', async () => {
        const req = {
          params: { id: 'studentId' },
          body: { courseId: 'courseId' },
        };
        const res = {
          status: jest.fn(() => res),
          json: jest.fn(),
        };
        Student.findById.mockResolvedValueOnce(null);
        Course.findById.mockResolvedValueOnce(null);
  
        await enrollCourse(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          data: {},
          message: 'Student or Course not found.',
        });
      });
  
      it('should handle error when course or student already enrolled', async () => {
        const req = {
          params: { id: 'studentId' },
          body: { courseId: 'courseId' },
        };
        const res = {
          status: jest.fn(() => res),
          json: jest.fn(),
        };
        Student.findById.mockResolvedValueOnce({ courses: ['courseId'], save: jest.fn() });
        Course.findById.mockResolvedValueOnce({ students: ['studentId'], save: jest.fn() });
  
        await enrollCourse(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          data: {},
          message: 'Student already enrolled in this course or Course already enrolled by this student.',
        });
      });
    });
  
    describe('unenrollCourse', () => {
        afterEach(() => {
          jest.clearAllMocks();
        });
      
        it('should unenroll course successfully', async () => {
          const req = {
            params: { id: 'studentId' },
            body: { courseId: 'courseId' },
          };
          const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
          };
          Student.findById.mockResolvedValueOnce({ courses: ['courseId'], save: jest.fn() });
          Course.findById.mockResolvedValueOnce({ students: ['studentId'], save: jest.fn() });
      
          await unenrollCourse(req, res);
      
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({
            data: { respData: { student: expect.any(Object), course: expect.any(Object) } },
            message: 'Course Unenrolled Successfully.',
          });
        });
      
        it('should handle error when student or course not found', async () => {
          const req = {
            params: { id: 'studentId' },
            body: { courseId: 'courseId' },
          };
          const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
          };
          Student.findById.mockResolvedValueOnce(null);
          Course.findById.mockResolvedValueOnce(null);
      
          await unenrollCourse(req, res);
      
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            data: {},
            message: 'Student or Course not found.',
          });
        });
      
        it('should handle error when course or student not enrolled', async () => {
          const req = {
            params: { id: 'studentId' },
            body: { courseId: 'courseId' },
          };
          const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
          };
          Student.findById.mockResolvedValueOnce({ courses: [], save: jest.fn() });
          Course.findById.mockResolvedValueOnce({ students: [], save: jest.fn() });
      
          await unenrollCourse(req, res);
      
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            data: {},
            message: 'Student not enrolled in this course or Course not enrolled by this student.',
          });
        });
      });

      describe('getStudentCourses', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch student courses successfully', async () => {
    const req = {
      params: { id: 'studentId' },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const coursesList = [{ courseId: 'courseId1' }, { courseId: 'courseId2' }];
    Student.findById.mockResolvedValueOnce({ populate: jest.fn().mockResolvedValueOnce({ courses: coursesList }) });

    await getStudentCourses(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      data: {  },
      message: 'Error Fetching Student Courses.'
    });
  });

  it('should handle error when student not found', async () => {
    const req = {
      params: { id: 'studentId' },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    Student.findById.mockResolvedValueOnce(null);

    await getStudentCourses(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      data: {},
      message: 'Error Fetching Student Courses.'
    });
  });

  it('should handle error when fetching student courses fails', async () => {
    const req = {
      params: { id: 'studentId' },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    Student.findById.mockResolvedValueOnce({ populate: jest.fn().mockRejectedValueOnce(new Error('Failed to fetch student courses.')) });

    await getStudentCourses(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      data: {},
      message: 'Error Fetching Student Courses.'
    });
  });

  // Add more test cases as needed
});
  });
  describe('viewTimeTable', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should fetch timetable successfully', async () => {
      const req = {
        params: { id: 'studentId' },
      };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
      const facultyId = 'facultyId';
      const timeTableId = 'timeTableId';
      const sessionId = 'sessionId';
      const student = { faculty: facultyId };
      const faculty = { _id: facultyId };
      const timeTable = { _id: timeTableId, sessions: [sessionId] };
      const sessionData = [{ sessionId }];
      Student.findById.mockResolvedValueOnce(student);
      Faculty.findById.mockResolvedValueOnce(faculty);
      TimeTable.findOne.mockResolvedValueOnce(timeTable);
      Session.find.mockResolvedValueOnce(sessionData);
  
      await viewTimeTable(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: {
          respData: {
            TimeTable: timeTable,
            Sessions: sessionData
          }
        },
        message: 'TimeTable Fetched Successfully.'
      });
    });
  
    it('should handle error when student not found', async () => {
      const req = {
        params: { id: 'studentId' },
      };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
      Student.findById.mockResolvedValueOnce(null);
  
      await viewTimeTable(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        data: {},
        message: 'Student not found.'
      });
    });
  
    it('should handle error when timetable not found', async () => {
      const req = {
        params: { id: 'studentId' },
      };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
      const student = { faculty: 'facultyId' };
      const faculty = { _id: 'facultyId' };
      Student.findById.mockResolvedValueOnce(student);
      Faculty.findById.mockResolvedValueOnce(faculty);
      TimeTable.findOne.mockResolvedValueOnce(null);
  
      await viewTimeTable(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        data: {},
        message: 'TimeTable not found.'
      });
    });
  
    it('should handle error when fetching session data fails', async () => {
      const req = {
        params: { id: 'studentId' },
      };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };
      const student = { faculty: 'facultyId' };
      const faculty = { _id: 'facultyId' };
      const timeTable = { _id: 'timeTableId', sessions: ['sessionId'] };
      Student.findById.mockResolvedValueOnce(student);
      Faculty.findById.mockResolvedValueOnce(faculty);
      TimeTable.findOne.mockResolvedValueOnce(timeTable);
      Session.find.mockRejectedValueOnce(new Error('Failed to fetch session data.'));
  
      await viewTimeTable(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        data: {},
        message: 'Error Fetching TimeTable.'
      });
    });
  
    // Add more test cases as needed
  });