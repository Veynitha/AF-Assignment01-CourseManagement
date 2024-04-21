const {
    createCourse,
    getAllCourses,
    getCourseById,
    assignFacultyToCourse,
    getStudentsOfCourse
} = require('../../controllers/courseController'); 

const Course = require('../../models/courseModel');
const Student = require('../../models/studentModel');

jest.mock('../../models/courseModel');
jest.mock('../../models/studentModel');

describe('createCourse', () => {
    it('should create a new course', async () => {
        const req = {
            body: {
                name: 'Test Course',
                code: 'TC101',
                description: 'Test Description',
                credits: 3
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        Course.prototype.save.mockResolvedValueOnce(req.body);
        
        await createCourse(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it('should handle errors while creating a course', async () => {
        const req = {
            body: {
                name: 'Test Course',
                code: 'TC101',
                description: 'Test Description',
                credits: 3
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        Course.prototype.save.mockRejectedValueOnce('Error');

        await createCourse(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith('Error Creating Course.');
    });
});

describe('getAllCourses', () => {
    it('should get all courses', async () => {
        const courses = [{ name: 'Course 1' }, { name: 'Course 2' }];
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        Course.find.mockResolvedValueOnce(courses);

        await getAllCourses(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(courses);
    });

    it('should handle errors while getting all courses', async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        Course.find.mockRejectedValueOnce('Error');

        await getAllCourses(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith('Error Retreiving Courses.');
    });
});

describe('getCourseById', () => {
    it('should get a course by ID', async () => {
        const courseId = '123456789';
        const courseData = { name: 'Test Course', code: 'TC101', description: 'Test Description', credits: 3 };
        const req = { params: { id: courseId } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        Course.findById.mockResolvedValueOnce(courseData);

        await getCourseById(req, res);

        expect(Course.findById).toHaveBeenCalledWith(courseId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(courseData);
    });

    it('should handle course not found', async () => {
        const courseId = '123456789';
        const req = { params: { id: courseId } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        Course.findById.mockResolvedValueOnce(null);

        await getCourseById(req, res);

        expect(Course.findById).toHaveBeenCalledWith(courseId);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith('Error Retreiving Course.');
    });

    it('should handle errors while getting course by ID', async () => {
        const courseId = '123456789';
        const req = { params: { id: courseId } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        Course.findById.mockRejectedValueOnce('Error');

        await getCourseById(req, res);

        expect(Course.findById).toHaveBeenCalledWith(courseId);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith('Error Retreiving Course.');
    });
});

describe('assignFacultyToCourse', () => {
    it('should assign faculty to a course', async () => {
        const courseId = '123456789';
        const facultyId = '987654321';
        const req = {
            params: { id: courseId },
            body: { facultyId }
        };
        const course = {
            _id: courseId,
            faculty: null,
            save: jest.fn().mockResolvedValueOnce({ _id: courseId, faculty: facultyId })
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        Course.findById.mockResolvedValueOnce(course);

        await assignFacultyToCourse(req, res);

        expect(Course.findById).toHaveBeenCalledWith(courseId);
        expect(course.faculty).toBe(null);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ data: {}, message: "Error Assigning Faculty to Course." });
    });

    it('should handle course not found', async () => {
        const courseId = '123456789';
        const facultyId = '987654321';
        const req = {
            params: { id: courseId },
            body: { facultyId }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        Course.findById.mockResolvedValueOnce(null);

        await assignFacultyToCourse(req, res);

        expect(Course.findById).toHaveBeenCalledWith(courseId);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ data: {}, message: "Error Assigning Faculty to Course." });
    });

    it('should handle errors while assigning faculty to course', async () => {
        const courseId = '123456789';
        const facultyId = '987654321';
        const req = {
            params: { id: courseId },
            body: { facultyId }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        Course.findById.mockRejectedValueOnce('Error');

        await assignFacultyToCourse(req, res);

        expect(Course.findById).toHaveBeenCalledWith(courseId);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ data: {}, message: "Error Assigning Faculty to Course." });
    });
});

describe('getStudentsOfCourse', () => {
    it('should get students of a course', async () => {
        const courseId = '123456789';
        const studentList = [{ name: 'Student 1' }, { name: 'Student 2' }];
        const req = { params: { id: courseId } };
        const course = {
            _id: courseId,
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        Course.findById.mockResolvedValueOnce(course);
        Student.find.mockResolvedValueOnce(studentList);

        await getStudentsOfCourse(req, res);

        expect(Course.findById).toHaveBeenCalledWith(courseId);
        expect(Student.find).toHaveBeenCalledWith({ courses: courseId });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: { Students: studentList }, message: "Students fetched successfully!" });
    });

    it('should handle course not found', async () => {
        const courseId = '123456789';
        const req = { params: { id: courseId } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        Course.findById.mockResolvedValueOnce(null);

        await getStudentsOfCourse(req, res);

        expect(Course.findById).toHaveBeenCalledWith(courseId);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ data: {}, message: "Course not found" });
    });

    it('should handle errors while fetching students of course', async () => {
        const courseId = '123456789';
        const req = { params: { id: courseId } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        Course.findById.mockRejectedValueOnce('Error');

        await getStudentsOfCourse(req, res);

        expect(Course.findById).toHaveBeenCalledWith(courseId);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ data: {}, message: "Internal server error" });
    });
});

