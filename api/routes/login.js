const path = require('path');
const appRoot = path.dirname(require.main.filename);

const express = require('express');
const router = express.Router();

const {login_http} = require(appRoot.concat('/api/drivers/login'));
router.post('/',login_http);

module.exports = router;