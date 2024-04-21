const express = require('express');
const notificationController = require('../controllers/notificationController');
const ROLES_LIST = require('../config/roleList');
const verifyRoles = require('../middlewares/verifyRoles');

const router = express.Router();

//Create Notification
router.post('/create-notification', notificationController.createNotification)


module.exports = router;