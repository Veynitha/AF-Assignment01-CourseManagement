const Course = require('../models/courseModel');
const Student = require('../models/studentModel');
const Faculty = require('../models/facultyModel');	

exports.createCourse = async (req, res) => {
    try {
        const {
            name,
            code,
            description,
            credits
        } = req.body

        const newCourse = new Course({
            name,
            code,
            description,
            credits,
            faculty: "",
            students: []
        });

        const courseCreated = await newCourse.save()

        res.status(201).json(courseCreated)
    } catch (error) {
        console.log(error)
        res.status(400).json("Error Creating Course.")
    }
}

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        if (courses) {
            return res.status(200).json(courses)
        }
    } catch (error) {
        return res.status(400).json("Error Retreiving Courses.")
    }
}

exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            return res.status(200).json(course)
        }
        else{
            return res.status(400).json("Error Retreiving Course.")
        }
    } catch (error) {
        return res.status(400).json("Error Retreiving Course.")
    }
}

exports.assignFacultyToCourse = async (req, res) => {
    try {
        const {id} = req.params;

        const {
            facultyId
        } = req.body

        const course = await Course.findById(id);
        const faculty = await Faculty.findById(facultyId);

        if (course && faculty) {
            course.faculty = facultyId;
            await course.save();

            faculty.courses.push(id);
            await faculty.save();

            const respData = {
                course,
                faculty
            }

            return res.status(200).json({data: respData, message: "Faculty Assigned to Course Successfully!"})
        }
        else{
            return res.status(400).json({data: {}, message:"Error Faculty or Course does not exist."})
        }
    } catch (error) {
        return res.status(500).json({data: {}, message: "Error Assigning Faculty to Course."})
    }
}

exports.getStudentsOfCourse = async (req, res) => {
    try {
        const { id } = req.params;

        // Retrieve course and populate students
        const course = await Course.findById(id);

        if (!course) {
            return res.status(400).json({data: {}, message: "Course not found" });
        }

        // Retrieve students belonging to the course
        const studentList = await Student.find({ courses: id });

        const responseData = {
            Students: studentList
        };

        return res.status(200).json({ data: responseData, message: "Students fetched successfully!" });
    } catch (error) {
        console.error("Error fetching students:", error);
        return res.status(500).json({data: {}, message: "Internal server error" });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const {id} = req.params;
        
        const {
            name,
            code,
            description,
            credits
        } = req.body;

        const course = await Course.findById(id);

        if (course) {
            course.name = name;
            course.code = code;
            course.description = description;
            course.credits = credits;
            await course.save();

            return res.status(200).json({data: course, message: "Course Updated Successfully!"})
        }
        else{
            return res.status(400).json({data: {}, message:"Error Course does not exist."})
        }
    } catch (error) {
        return res.status(500).json({data: {}, message: "Error Updating Course."})
    }
}

exports.deleteCourse = async (req, res) => {
    try {
        const {id} = req.params;

        const course = await Course.findById(id);

        if (course) {
            const deletedCourse = await Course.findByIdAndDelete(id);
            if(deletedCourse){
                return res.status(200).json({data: course, message: "Course Deleted Successfully!"})
            }
            else{
                throw new Error("Error Deleting Course.")
            }
        }
        else{
            return res.status(400).json({data: {}, message:"Error Course does not exist."})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({data: {}, message: "Error Deleting Course."})
    }
}

