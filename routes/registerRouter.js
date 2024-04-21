const express = require('express');
const registerController = require('../controllers/registerController');

const router = express.Router();


//Register Student
router.post('/student-registration', registerController.registerStudent);
//Register Admin
router.post('/admin-registration', registerController.registerAdmin);
//Register Faculty
router.post('/faculty-registration', registerController.registerFaculty);

module.exports = router;