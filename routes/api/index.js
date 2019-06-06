const express = require('express');
const v1router = require('./v1');

const router = express.Router();

router.use('/v1', v1router);

module.exports = router;