
const path = require('path');
const appRoot = path.dirname(require.main.filename);
const express = require('express');
const router = express.Router();
const {register_http} = require(appRoot.concat('/api/drivers/register'));


router.post('/', register_http);


module.exports = router;