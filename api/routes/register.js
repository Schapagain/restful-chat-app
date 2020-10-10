
const path = require('path');
const appRoot = path.dirname(require.main.filename);
const express = require('express');
const router = express.Router();
const registerDriver = require(appRoot.concat('/api/drivers/register'));

router.post('/', registerDriver);

module.exports = router;