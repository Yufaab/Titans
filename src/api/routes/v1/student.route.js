const express = require('express');
const studentController = require('../../controller/student.controller');
const studentAuth = require('../../middleware/auth');

const router = express.Router();

router.route('/login').post(studentController.loginStudent);

router.route('/signup').post(studentController.signupStudent);

router.route('/logout').post(studentAuth, studentController.logoutStudent);

router.route('/order').post(studentAuth, studentController.createOrder);

router.route('/order/:orderid').get(studentAuth, studentController.getOrder);

router.route('/order/:orderid').delete(studentAuth, studentController.deleteOrder);

router.route('/order').get(studentAuth, studentController.getAllOrder);

router.route('/generate/result').get(studentAuth, studentController.generateCounsellingData);

router.route('/payment').post(studentAuth, studentController.makePayment);

module.exports = router;