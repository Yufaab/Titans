const express = require('express');
const httpStatus = require('http-status');
const studentRoutes = require('./student.route')
const commonRoutes = require('./common.route');

const router = express.Router();

router.get('/app/health', (req, res) => { 
  res.send({ status: httpStatus.OK }); 
});

router.use('/student', studentRoutes)
router.use('/api', commonRoutes)

module.exports = router;
