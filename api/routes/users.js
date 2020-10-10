
const path = require('path');
const appRoot = path.dirname(require.main.filename);
const express = require('express');
const router = express.Router();
const upload = require(appRoot.concat('/utils/image-upload'))
const {verifyAuthToken} = require(appRoot.concat('/utils/authorization'))
const usersDriver = require(appRoot.concat('/api/drivers/users'));

router.get('/',verifyAuthToken, usersDriver.getUsers);
router.get('/:username',verifyAuthToken, usersDriver.getUser);
router.patch('/:username',verifyAuthToken,upload.single('profile-picture'),usersDriver.updateUser);
router.delete('/:username',verifyAuthToken, usersDriver.deleteUser);
module.exports = router;