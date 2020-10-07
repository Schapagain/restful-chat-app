
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

router.patch('/:username', (req,res,next) => {
    const username = req.params.username;

    // Create comma seperated column='value' strings for all column: value pairs
    const fieldSpaceValues = 
    Object
        .keys(req.body)
        .map(key => 
        key.concat('=\'',req.body[key],'\''))
        .join(', ');

    const queryString = "update users set ".concat(fieldSpaceValues,' ','WHERE username=$1 RETURNING *');
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
            res.status(201).json({
                message: "User was removed successfully",
                user: result.rows[0],
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
});

module.exports = router;