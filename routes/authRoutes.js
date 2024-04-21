const express = require('express');
const loginController = require('../controllers/loginController');
const refreshController = require('../controllers/refreshController');
const logoutController = require('../controllers/logoutController');

const router = express.Router();


//Login 
router.post('/login', loginController.handleLogin);
//Refresh Token
router.post('/token', refreshController.handleRefreshToken);
//Logout
router.post('/logout', logoutController.handleLogout);

module.exports = router;