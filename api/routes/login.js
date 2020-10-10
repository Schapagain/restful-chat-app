const path = require('path');
const appRoot = path.dirname(require.main.filename);

const express = require('express');
const router = express.Router();

const loginDriver = require(appRoot.concat('/api/drivers/login'));
router.post('/',loginDriver);

module.exports = router;