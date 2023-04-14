const express = require('express');
const studentController = require('../../controller/student.controller');
const studentAuth = require('../../middleware/auth');

const router = express.Router();

router.route('/login').post(studentController.loginStudent);

router.route('/signup').post(studentController.signupStudent);

router.route('/:studentid/update').post(studentAuth, studentController.updateData);

module.exports = router;