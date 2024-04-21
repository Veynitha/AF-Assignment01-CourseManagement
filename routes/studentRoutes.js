const express = require('express');
const studentController = require('../controllers/studentController');
const ROLES_LIST = require('../config/roleList');
const verifyRoles = require('../middlewares/verifyRoles');

const router = express.Router();

//Enroll Course
router.post('/enroll-course/:id', studentController.enrollCourse)
//Unenroll Course
router.put('/unenroll-course/:id', studentController.unenrollCourse)
//Get Courses
router.get('/get-studentCourses/:id', studentController.getStudentCourses)
//Get Student TimeTable
router.get('/get-studentTimeTable/:id', studentController.viewTimeTable)

module.exports = router;