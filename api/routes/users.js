
const path = require('path');
const appRoot = path.dirname(require.main.filename);
const express = require('express');
const router = express.Router();
const db = require(appRoot.concat('/db'));
const upload = require(appRoot.concat('/utils/image-upload'))

router.get('/',(req,res,next) => {
    const queryString = "SELECT * FROM users";

    db.query(queryString)
    .then(result => {
        res.status(201).json({
            message: "These are all the users:",
            users: result.rows,
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err.message,
        });
    }); 
});

router.get('/:username', (req,res,next) => {
    const username = req.params.username;
    const queryString = "SELECT * FROM users WHERE username=$1";
    const queryValues = [username];

    db.query(queryString,queryValues)
    .then(result => {
        if (!result.rowCount){
            res.status(404).json({
                message: "User not found",
            });
        }else{

            res.status(201).json({
                message: "User was found",
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

router.patch('/:username',upload.single('profile-picture'),(req,res,next) => {
    const username = req.params.username;
    const profilePicture = req.file;

    // Inject name of the profile picture stored if a valid image was given
    if(profilePicture != null) {
        const extension = profilePicture.originalname.split('.').pop();
        const profilePictureName = username.concat('.',extension);
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

router.delete('/:username', (req,res,next) => {
    const username = req.params.username;
    const queryString = "DELETE FROM users WHERE username=$1 RETURNING *";
    const queryValues = [username];

    db.query(queryString,queryValues)
    .then( result => {

        if (!result.rowCount){
            res.status(404).json({
                message: "User not found",
            });
        }else{
            removeUserLogin(username)
            .then( () => removeChatReceived(username)
                .then( () => {
                    res.status(200).json({
                        message : "User removed successfully",
                        user: result.rows[0],
                    })
                })
            )
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
});

const removeUserLogin = username => {
    const queryString = "DELETE from login WHERE username=$1";
    const queryValues = [username];
    return db
        .query(queryString,queryValues)
        .catch( err => console.log(err));
}

const removeChatReceived = username => {
    const queryString = "DELETE FROM chats WHERE receiver=$1";
    const queryValues = [username];
    return db
        .query(queryString,queryValues)
        .catch( err => console.log(err));

}

module.exports = router;