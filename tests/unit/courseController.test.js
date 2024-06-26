const {
  createCourse,
  getAllCourses,
  getCourseById,
  assignFacultyToCourse,
  getStudentsOfCourse,
  updateCourse,
  deleteCourse,
} = require("../../controllers/courseController");

const Course = require("../../models/courseModel");
const Student = require("../../models/studentModel");
const Faculty = require("../../models/facultyModel");

jest.mock("../../models/courseModel");
jest.mock("../../models/studentModel");

describe("createCourse", () => {
  it("should create a new course", async () => {
    const req = {
      body: {
        name: "Test Course",
        code: "TC101",
        description: "Test Description",
        credits: 3,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Course.prototype.save.mockResolvedValueOnce(req.body);

    await createCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(req.body);
  });

  it("should handle errors while creating a course", async () => {
    const req = {
      body: {
        name: "Test Course",
        code: "TC101",
        description: "Test Description",
        credits: 3,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Course.prototype.save.mockRejectedValueOnce("Error");

    await createCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith("Error Creating Course.");
  });
});

describe("getAllCourses", () => {
  it("should get all courses", async () => {
    const courses = [{ name: "Course 1" }, { name: "Course 2" }];
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Course.find.mockResolvedValueOnce(courses);

    await getAllCourses(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(courses);
  });

  it("should handle errors while getting all courses", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Course.find.mockRejectedValueOnce("Error");

    await getAllCourses(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith("Error Retreiving Courses.");
  });
});

describe("getCourseById", () => {
  it("should get a course by ID", async () => {
    const courseId = "123456789";
    const courseData = {
      name: "Test Course",
      code: "TC101",
      description: "Test Description",
      credits: 3,
    };
    const req = { params: { id: courseId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Course.findById.mockResolvedValueOnce(courseData);

    await getCourseById(req, res);

    expect(Course.findById).toHaveBeenCalledWith(courseId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(courseData);
  });

  it("should handle course not found", async () => {
    const courseId = "123456789";
    const req = { params: { id: courseId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Course.findById.mockResolvedValueOnce(null);

    await getCourseById(req, res);

    expect(Course.findById).toHaveBeenCalledWith(courseId);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith("Error Retreiving Course.");
  });

  it("should handle errors while getting course by ID", async () => {
    const courseId = "123456789";
    const req = { params: { id: courseId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Course.findById.mockRejectedValueOnce("Error");

    await getCourseById(req, res);

    expect(Course.findById).toHaveBeenCalledWith(courseId);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith("Error Retreiving Course.");
  });
});

describe("getStudentsOfCourse", () => {
  it("should get students of a course", async () => {
    const courseId = "123456789";
    const studentList = [{ name: "Student 1" }, { name: "Student 2" }];
    const req = { params: { id: courseId } };
    const course = {
      _id: courseId,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Course.findById.mockResolvedValueOnce(course);
    Student.find.mockResolvedValueOnce(studentList);

    await getStudentsOfCourse(req, res);

    expect(Course.findById).toHaveBeenCalledWith(courseId);
    expect(Student.find).toHaveBeenCalledWith({ courses: courseId });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: { Students: studentList },
      message: "Students fetched successfully!",
    });
  });

  it("should handle course not found", async () => {
    const courseId = "123456789";
    const req = { params: { id: courseId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Course.findById.mockResolvedValueOnce(null);

    await getStudentsOfCourse(req, res);

    expect(Course.findById).toHaveBeenCalledWith(courseId);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      data: {},
      message: "Course not found",
    });
  });

  it("should handle errors while fetching students of course", async () => {
    const courseId = "123456789";
    const req = { params: { id: courseId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    Course.findById.mockRejectedValueOnce("Error");

    await getStudentsOfCourse(req, res);

    expect(Course.findById).toHaveBeenCalledWith(courseId);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      data: {},
      message: "Internal server error",
    });
  });

  describe("updateCourse", () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        params: { id: "courseId" },
        body: {
          name: "New Course Name",
          code: "NEW101",
          description: "New course description",
          credits: 3,
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should update the course and return a success message", async () => {
      const mockCourse = {
        _id: "courseId",
        name: "Old Course Name",
        code: "OLD101",
        description: "Old course description",
        credits: 4,
        save: jest.fn().mockResolvedValue(),
      };

      jest.spyOn(Course, "findById").mockResolvedValueOnce(mockCourse);

      await updateCourse(req, res);

      expect(Course.findById).toHaveBeenCalledWith("courseId");
      expect(mockCourse.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: expect.objectContaining({
          _id: "courseId",
          name: "New Course Name",
          code: "NEW101",
          description: "New course description",
          credits: 3,
        }),
        message: "Course Updated Successfully!",
      });
    });

    it("should return an error if course is not found", async () => {
      jest.spyOn(Course, "findById").mockResolvedValueOnce(null);

      await updateCourse(req, res);

      expect(Course.findById).toHaveBeenCalledWith("courseId");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        data: {},
        message: "Error Course does not exist.",
      });
    });

    it("should handle errors gracefully", async () => {
      const mockError = new Error("Test error");
      jest.spyOn(Course, "findById").mockRejectedValueOnce(mockError);

      await updateCourse(req, res);

      expect(Course.findById).toHaveBeenCalledWith("courseId");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        data: {},
        message: "Error Updating Course.",
      });
    });
  });

  describe("deleteCourse", () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        params: { id: "courseId" },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should delete the course and return a success message", async () => {
      const mockCourse = {
        _id: "courseId",
        name: "Course Name",
        code: "101",
        description: "Course description",
        credits: 3,
      };

      jest.spyOn(Course, "findById").mockResolvedValueOnce(mockCourse);
      jest.spyOn(Course, "findByIdAndDelete").mockResolvedValueOnce(mockCourse);

      await deleteCourse(req, res);

      expect(Course.findById).toHaveBeenCalledWith("courseId");
      expect(Course.findByIdAndDelete).toHaveBeenCalledWith("courseId");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: expect.objectContaining({
          _id: "courseId",
          name: "Course Name",
          code: "101",
          description: "Course description",
          credits: 3,
        }),
        message: "Course Deleted Successfully!",
      });
    });

    it("should return an error if course is not found", async () => {
      jest.spyOn(Course, "findById").mockResolvedValueOnce(null);

      await deleteCourse(req, res);

      expect(Course.findById).toHaveBeenCalledWith("courseId");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        data: {},
        message: "Error Course does not exist.",
      });
    });

    it("should return an error if course deletion fails", async () => {
      const mockCourse = {
        _id: "courseId",
        name: "Course Name",
        code: "101",
        description: "Course description",
        credits: 3,
      };

      jest.spyOn(Course, "findById").mockResolvedValueOnce(mockCourse);
      jest.spyOn(Course, "findByIdAndDelete").mockResolvedValueOnce(null);

      await deleteCourse(req, res);

      expect(Course.findById).toHaveBeenCalledWith("courseId");
      expect(Course.findByIdAndDelete).toHaveBeenCalledWith("courseId");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        data: {},
        message: "Error Deleting Course.",
      });
    });

    it("should handle errors gracefully", async () => {
      const mockError = new Error("Test error");
      jest.spyOn(Course, "findById").mockRejectedValueOnce(mockError);

      await deleteCourse(req, res);

      expect(Course.findById).toHaveBeenCalledWith("courseId");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        data: {},
        message: "Error Deleting Course.",
      });
    });
  });
});
describe("assignFacultyToCourse", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { id: "courseId" },
      body: {
        facultyId: "facultyId",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should assign faculty to course and return a success message", async () => {
    const mockCourse = {
      _id: "courseId",
      name: "Course Name",
      code: "101",
      description: "Course description",
      credits: 3,
      save: jest.fn().mockResolvedValue(),
    };

    const mockFaculty = {
      _id: "facultyId",
      name: "Faculty Name",
      courses: [],
      save: jest.fn().mockResolvedValue(),
    };

    jest.spyOn(Course, "findById").mockResolvedValueOnce(mockCourse);
    jest.spyOn(Faculty, "findById").mockResolvedValueOnce(mockFaculty);

    await assignFacultyToCourse(req, res);

    expect(Course.findById).toHaveBeenCalledWith("courseId");
    expect(Faculty.findById).toHaveBeenCalledWith("facultyId");
    expect(mockCourse.save).toHaveBeenCalled();
    expect(mockFaculty.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        course: expect.objectContaining(mockCourse),
        faculty: expect.objectContaining(mockFaculty),
      },
      message: "Faculty Assigned to Course Successfully!",
    });
  });

  it("should return an error if course or faculty does not exist", async () => {
    jest.spyOn(Course, "findById").mockResolvedValueOnce(null);
    jest.spyOn(Faculty, "findById").mockResolvedValueOnce(null);

    await assignFacultyToCourse(req, res);

    expect(Course.findById).toHaveBeenCalledWith("courseId");
    expect(Faculty.findById).toHaveBeenCalledWith("facultyId");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      data: {},
      message: "Error Faculty or Course does not exist.",
    });
  });

  it("should handle errors gracefully", async () => {
    const mockError = new Error("Test error");
    jest.spyOn(Course, "findById").mockRejectedValueOnce(mockError);

    await assignFacultyToCourse(req, res);

    expect(Course.findById).toHaveBeenCalledWith("courseId");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      data: {},
      message: "Error Assigning Faculty to Course.",
    });
  });
});
