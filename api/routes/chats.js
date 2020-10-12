
const path = require('path');
const appRoot = path.dirname(require.main.filename);
const express = require('express');
const router = express.Router();
const {verifyAuthToken} = require(appRoot.concat('/utils/authorization'));

// Database connection
const db = require(appRoot.concat('/db'));
const chatDriver = require(appRoot.concat('/api/drivers/chats'));

router.get('/',verifyAuthToken,(req,res,next) => {
    const queryString = "SELECT * FROM chats";

    db.query(queryString)
    .then(result => {
        res.status(201).json({
            message: "These are all the chats:",
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

router.post('/',verifyAuthToken, chatDriver.addChat);
router.get('/:username',verifyAuthToken, chatDriver.getChat);

router.delete('/:username',verifyAuthToken, (req,res,next) => {
    const username = req.params.username;
    const allChats = {};
    removeChatsFromDb(username,true)
    .then ( (result) => {
        allChats.sent = result.rows;
        removeChatsFromDb(username,false)
        .then( (result) => {
            allChats.received = result.rows;
            res.status(200).json({
                message: "Chat deleted successfully",
                chats: allChats,
            })
        })
    })
    .catch( err => {
        console.log(err)
        res.status(500).json({
            message: "Could not remove chats",
            error: err.message,
        })
    })
});

const removeChatsFromDb = (username,isSender) => {
    const queryString =`DELETE FROM chats WHERE ${isSender?'sender':'receiver'}=$1 RETURNING *`;
    const queryValues = [username];
    return db.query(queryString,queryValues)
}

module.exports = router;