const express = require('express');
const router = express.Router();
const { getStatus, initiateProcess } = require('./controller');

router.post('/process', initiateProcess);

module.exports = router;
