const express = require('express');
const studentController = require('../../controller/student.controller');

const router = express.Router();

router.route('/login', studentController.loginStudent);

router.route('/signup', studentController.signupStudent);

module.exports = router;