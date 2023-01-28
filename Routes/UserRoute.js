// In Routes we have to Import logic functions from controllers 
const express = require('express');
const router = express.Router(); //Calling the router Middleware with express Library
const UserController = require('../controller/UserController.js')

router
.route('/register')
.post(UserController.Register)
router
.route('/login')
.post(UserController.Login)
router
.route('/changepassword')
.post(UserController.changePassword)
module.exports = router;