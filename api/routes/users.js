
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
            error: err,
        });
    }); 
});

router.post('/',(req,res,next) => {
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const cellNumber = req.body.cellnumber;

    // Generate random 32 bytes buffer and store as a string id
    // Remove all occurences of / in id since that will be taken as a different route by express
    const userId = secureRandom(32,{type: 'Buffer'}).toString('base64').replace(/\//g,'');
    const queryString = "INSERT INTO users(firstname,lastname,cellnumber,id) VALUES($1,$2,$3,$4) returning *";
    const queryValues = [firstName,lastName,cellNumber,userId];

    db.query(queryString,queryValues)
    .then(result =>{
        res.status(201).json({
            message: "User was added successfully",
            user: result.rows[0],
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });

});

router.get('/:userId', (req,res,next) => {
    const userId = req.params.userId;
    const queryString = "SELECT * FROM users WHERE id=$1";
    const queryValues = [userId];

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
            error: err,
        });
    });
});

router.patch('/:userId', (req,res,next) => {
    const userId = req.params.userId;

    // Create comma seperated column='value' strings for all column: value pairs
    const fieldSpaceValues = 
    Object
        .keys(req.body)
        .map(key => 
        key.concat('=\'',req.body[key],'\''))
        .join(', ');

    const queryString = "update users set ".concat(fieldSpaceValues,' ','WHERE id=$1 RETURNING *');
    const queryValues = [userId];

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
            error: err,
        });
    });
});

router.delete('/:userId', (req,res,next) => {
    const userId = req.params.userId;
    const queryString = "DELETE FROM users WHERE id=$1 RETURNING *";
    const queryValues = [userId];

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