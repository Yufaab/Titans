const express = require('express');
const commonController = require('../../controller/common.controller');


const router = express.Router();

router.route('/review/upload').post(commonController.uploadReviews);

router.route('/review/fetch').get(commonController.getReviews);

module.exports = router;