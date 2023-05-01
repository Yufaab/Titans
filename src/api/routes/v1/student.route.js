const express = require('express');
const studentController = require('../../controller/student.controller');
const studentAuth = require('../../middleware/auth');

const router = express.Router();

router.route('/login').post(studentController.loginStudent);

router.route('/signup').post(studentController.signupStudent);

router.route('/logout').post(studentAuth, studentController.logoutStudent);

router.route('/:studentid/update').post(studentAuth, studentController.updateData);

router.route('/order').post(studentAuth, studentController.createOrder);

router.route('/order/:orderid').get(studentAuth, studentController.getOrder);

router.route('/generate/result').get(studentAuth, studentController.generateCounsellingData);

module.exports = router;