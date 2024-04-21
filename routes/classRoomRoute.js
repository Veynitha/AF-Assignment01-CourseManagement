const express = require('express');
const classRoomController = require('../controllers/classRoomController');
const ROLES_LIST = require('../config/roleList');
const verifyRoles = require('../middlewares/verifyRoles');

const router = express.Router();

//Create ClassRoom
router.post('/create-classroom', verifyRoles(ROLES_LIST.ADMIN), classRoomController.createClassRoom)
//Get all ClassRoom
router.get('/get-classrooms', classRoomController.getAllClassRooms)
//Get ClassRoom By Id
router.get('/get-classroom/:id', classRoomController.getClassRoomById)
//Update ClassRoom
router.post('/update-classroom/:id', verifyRoles(ROLES_LIST.ADMIN), classRoomController.updateClassRoom)

module.exports = router;