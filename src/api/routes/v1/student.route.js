const express = require('express');
const studentController = require('../../controller/student.controller');
const studentAuth = require('../../middleware/auth');

const router = express.Router();

router.route('/login', studentController.loginStudent);

router.route('/signup', studentController.signupStudent);

router.route('/:studentid/signup', studentAuth, studentController.updateData);

module.exports = router;