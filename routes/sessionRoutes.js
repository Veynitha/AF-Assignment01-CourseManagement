const express = require('express');
const sessionController = require('../controllers/sessionController');
const ROLES_LIST = require('../config/roleList');
const verifyRoles = require('../middlewares/verifyRoles');

const router = express.Router();

//Create Session
router.post('/create-session', verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.FACULTY), sessionController.createSession)
//Update Session
router.put('/update-session/:id', verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.FACULTY), sessionController.updateSession)
//Delete Session
router.delete('/delete-session/:id', verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.FACULTY), sessionController.deleteSession)

module.exports = router;