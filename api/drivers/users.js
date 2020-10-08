

const path = require('path');
const appRoot = path.dirname(require.main.filename);
const db = require(appRoot.concat('/db'));

const getUser_http = (req,res,next) => {
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
};

const getUser_socket = (socket,username) => {

    const queryString = "SELECT * FROM users WHERE username=$1";
    const queryValues = [username];
    db.query(queryString,queryValues)
    .then(result => {
        if (!result.rowCount){
            socket.emit('get-user-failure',{
                message: "User not found",
            });
        }else{

            socket.emit('get-user-success',{
                message: "User was found",
                user: result.rows[0],
            });
        }
    })
    .catch(err => {
        console.log(err);
        socket.emit('get-user-failure',{
            message: "User not found",
        })
    });
};

exports.getUser_http = getUser_http;
exports.getUser_socket = getUser_socket;