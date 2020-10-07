
const path = require('path');
const express = require('express');
const router = express.Router();
const secureRandom = require('secure-random');

// Database connection
// Using 123 as an id for everyone for now
// this will be username for users after login
const appRoot = path.dirname(require.main.filename);
const db = require(appRoot.concat('/db'));

router.get('/',(req,res,next) => {
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

router.post('/',(req,res,next) => {
    ({sender,receiver,message} = req.body);

    if (!sender || !receiver){
        throw new Error('Sender and receiver are required');
    }
    const queryString = "INSERT INTO chats (sender,message,receiver) VALUES ($1,$2,$3) RETURNING *";
    const queryValues = [sender,message,receiver];

    checkUserExistence(sender)
    .then( ()=> {
        return checkUserExistence(receiver)
        .then( () => {
            db
            .query(queryString,queryValues)
            .then(result => {
                res.status(201).json({
                    message: "Chat added successfully",
                    chat: result.rows[0],
                })
            })
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: "Could not add chat",
            error: err.message,
        })
    }); 

});

router.get('/:username', (req,res,next) => {
    const username = req.params.username;

    checkUserExistence(username)
    .then( () => {
        getUserChats(username)
        .then(result => {
            res.status(201).json({
                message: "These are all the chats for this user",
                chats: result,
            });
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err.message,
        });
    });
    
});

const getUserChats = username => {
    const allChats = {};
    return getChatsFromDb(username,true)
    .then (result => {
        allChats.sent = result.rows;
        return getChatsFromDb(username,false)
        .then (result => {
            allChats.received = result.rows;
            return allChats;
        })
    })
    .catch( err => {
        console.log(err)
    })
}

const getChatsFromDb = (username,isSender) => {
    const queryString =`SELECT * FROM chats WHERE ${isSender?'sender':'receiver'}=$1`;
    const queryValues = [username];
    return db.query(queryString,queryValues)
}

const checkUserExistence = username => {
    const queryString = "SELECT username FROM login WHERE username=$1";
    const queryValues = [username];
    return db
        .query(queryString,queryValues)
        .then( result => {
            if (result.rowCount <= 0) {
                throw new Error('User does not exist');
            }
        })
}

// router.delete('/:username', (req,res,next) => {
//     const username = req.params.username;
//     const queryString = "DELETE FROM users WHERE username=$1 RETURNING *";
//     const queryValues = [username];

//     db.query(queryString,queryValues)
//     .then( result => {

//         if (!result.rowCount){
//             res.status(404).json({
//                 message: "User not found",
//             });
//         }else{
//             res.status(201).json({
//                 message: "User was removed successfully",
//                 user: result.rows[0],
//             });
//         }
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json({
//             error: err,
//         });
//     });
// });

module.exports = router;