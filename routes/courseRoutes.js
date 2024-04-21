const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController')
const ROLES_LIST = require('../config/roleList');
const verifyRoles = require('../middlewares/verifyRoles');

//Create Course
router.post('/create-course', verifyRoles(ROLES_LIST.ADMIN), courseController.createCourse)
//Get All Courses
router.get('/get-courses', verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.FACULTY, ROLES_LIST.STUDENT), courseController.getAllCourses)
//Get Course By Id
router.get('/get-course/:id', verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.FACULTY, ROLES_LIST.STUDENT), courseController.getCourseById)
//Assign Faculty To Course
router.put('/assign-faculty/:id', verifyRoles(ROLES_LIST.ADMIN), courseController.assignFacultyToCourse)
//Get Students of a course
router.get('/get-students/:id',verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.FACULTY), courseController.getStudentsOfCourse)
//Update Course
router.put('/update-course/:id', verifyRoles(ROLES_LIST.ADMIN), courseController.updateCourse)
//Delete Course
router.delete('/delete-course/:id', verifyRoles(ROLES_LIST.ADMIN), courseController.deleteCourse)

module.exports = router;
