const express = require('express');
const resourceController = require('../controllers/resourceController');
const ROLES_LIST = require('../config/roleList');
const verifyRoles = require('../middlewares/verifyRoles');

const router = express.Router();

//Create Resource
router.post('/create-resource', resourceController.createResource)
//Update Resource
router.put('/update-resource/:id', resourceController.updateResource)
//Delete Resource
// router.delete('/delete-resource/:id', )

module.exports = router;