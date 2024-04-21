const Student = require('../models/studentModel');
const Course = require('../models/courseModel');
const Faculty = require('../models/facultyModel');
const TimeTable = require('../models/timeTableModel');
const Session = require('../models/sessionModel');

exports.enrollCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            courseId
        } = req.body

        const student = await Student.findById(id);
        const course = await Course.findById(courseId);

        if(student && course){
            const studentExists = student.courses.includes(courseId) 
            const courseExists = course.students.includes(id)
            if(!studentExists && !courseExists){
                student.courses.push(courseId);
                const studentSaved = await student.save();
                course.students.push(id);
                const courseSaved = await course.save();
                
                const respData = {
                    student,
                    course
                }
                if(studentSaved && courseSaved){
                    res.status(200).json({data: {respData}, message: "Course Enrolled Successfully."})
                }
                else{
                    res.status(400).json({data: {}, message: "Error Enrolling Course."})
                } 
            }
            else{
                res.status(400).json({data: {}, message: "Student already enrolled in this course or Course already enrolled by this student."})
            }
        }
        else{
            res.status(400).json({data: {}, message: "Student or Course not found."})
        
        }
    }
    catch (error) {
        console.log(error)
        res.status(400).json("Error Enrolling Course.")
    }
}

exports.unenrollCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            courseId
        } = req.body

        const student = await Student.findById(id);
        const course = await Course.findById(courseId);

        if(student && course){
            const studentExists = student.courses.includes(courseId) 
            const courseExists = course.students.includes(id)
            if(studentExists && courseExists){
                student.courses = student.courses.filter(course => course !== courseId);
                await student.save();
                course.students = course.students.filter(student => student !== id);
                await course.save();
                const respData = {
                    student,
                    course
                }
                res.status(200).json({data: {respData}, message: "Course Unenrolled Successfully."})
            }
            else{
                res.status(400).json({data: {}, message: "Student not enrolled in this course or Course not enrolled by this student."})
            }
        }
        else{
            res.status(400).json({data: {}, message: "Student or Course not found."})
        }
    }
    catch (error) {
        console.log(error)
        res.status(400).json("Error Unenrolling Course.")
    }
}

exports.getStudentCourses = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id).populate('courses');

        const coursesList = await Course.find({students: id});

        if(student){
            res.status(200).json({data: {Courses:coursesList}, message: "Student Courses Fetched Successfully."})
        }
        else{
            res.status(400).json({data: {}, message: "Student not found."})
        }
    }
    catch (error) {
        console.log(error)
        res.status(400).json({data: {}, message:"Error Fetching Student Courses."})
    }
}

exports.viewTimeTable = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id);

        if(student){
            const faculty = await Faculty.findById(student.faculty);
            if(faculty){
                const timeTable = await TimeTable.findOne({faculty: faculty._id});
                if(timeTable){
                    const sessionData = await Session.find({ _id: { $in: timeTable.sessions } });
                    const respData = {
                        TimeTable: timeTable,
                        Sessions: sessionData
                    }
                    res.status(200).json({data: {respData}, message: "TimeTable Fetched Successfully."})
                }
                else{
                    res.status(400).json({data: {}, message: "TimeTable not found."})
                }
            }
        }
        else{
            res.status(400).json({data: {}, message: "Student not found."})
        }
    } catch (error) {
        res.status(400).json({data: {}, message: "Error Fetching TimeTable."})
    }
}




