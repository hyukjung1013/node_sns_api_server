const express = require('express');
const v1router = require('./v1');
const v2router = require('./v2');

const router = express.Router();

router.use('/v1', v1router);
router.use('/v2', v2router);

module.exports = router;