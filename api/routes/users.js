
const path = require('path');
const appRoot = path.dirname(require.main.filename);
const express = require('express');
const router = express.Router();
const db = require(appRoot.concat('/db'));
const upload = require(appRoot.concat('/utils/image-upload'))
const {verifyAuthToken} = require(appRoot.concat('/utils/authorization'))
const serverAddress = 'http://localhost:' + process.env.PORT;
const usersDriver = require(appRoot.concat('/api/drivers/users'));

router.get('/',verifyAuthToken, usersDriver.getUsers);
router.get('/:username',verifyAuthToken, usersDriver.getUser);

router.patch('/:username',verifyAuthToken,upload.single('profile-picture'),(req,res,next) => {
    const username = req.params.username;
    const profilePicture = req.file;

    // Inject name of the profile picture stored if a valid image was given
    if(profilePicture != null) {
        const extension = profilePicture.originalname.split('.').pop();
        const profilePictureName = serverAddress.concat('/uploads/',username,'.',extension);
        req.body.profilepicture = profilePictureName;
    };

    // Create comma seperated column='value' strings for all column: value pairs
    const fieldValuePairs = 
    Object
        .keys(req.body)
        .map(key => 
        key.concat('=\'',req.body[key],'\''))
        .join(', ');
    if (!fieldValuePairs) {
        throw new Error('Nothing to update');
    }
    const queryString = "update users set ".concat(fieldValuePairs,' ','WHERE username=$1 RETURNING *');
    const queryValues = [username];
    db.query(queryString,queryValues)
    .then( result => {
        if (!result || !result.rowCount){
            res.status(404).json({
                message: "User not found",
            });
        }else{
            res.status(201).json({
                message: "User was updated successfully",
                user: result.rows[0],
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err.message,
        });
    });
});

router.delete('/:username',verifyAuthToken, usersDriver.deleteUser);

module.exports = router;