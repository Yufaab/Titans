const express = require('express');
const httpStatus = require('http-status');

const router = express.Router();

router.get('/app/health', (req, res) => {
  res.send({ status: httpStatus.OK });
});

module.exports = router;
