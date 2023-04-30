const express = require('express');
const httpStatus = require('http-status');
const studentRoutes = require('./studentRoute')

const router = express.Router();

router.get('/app/health', (req, res) => { 
  res.send({ status: httpStatus.OK }); 
});

router.use('/student', studentRoutes)

module.exports = router;
