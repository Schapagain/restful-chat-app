const path = require('path');
const appRoot = path.dirname(require.main.filename);
const bcrypt = require('bcrypt');
const {getAuthToken} = require(appRoot.concat('/utils/authorization'));
const db = require(appRoot.concat('/db'));

const login_http = (req,res,next) => {
        ({username,password} = req.body);
        if (!username || !password){
            throw new Error("Username and password are required");
        }

        getUserCredentials({username,password})
        .then( user => {

            if (!user || !user.password){
                throw new Error('Invalid credentials');
            }
            validatePassword(user.password,password)
            .then( passwordMatch => {
                if (passwordMatch){
                    const token = getAuthToken(user.username);
                    res.status(200).json({
                    message: "Authorized",
                    token,
                    })
                }else{
                    next(new Error("Invalid credentials"));
                }
            })
            .catch( err => {
                console.log(err);
                throw err;    
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: "Authorization not successfull",
            })
        }); 
  };

const login_socket = (socket,user) => {
    ({username,password} = user);
    if (!username || !password){
        throw new Error("Username and password are required");
    }

    getUserCredentials(user)
    .then( userReturned => {

        if (!userReturned || !userReturned.password){
            throw new Error('Invalid credentials');
        }
        validatePassword(userReturned.password,user.password)
        .then( passwordMatch => {
            if (passwordMatch){
                const token = getAuthToken(userReturned.username);
                socket.emit('login-success',{
                message: "Authorized",
                token,
                })
            }else{
                socket.emit('login-failure',{
                    error: "Authorization not successfull"
                })
            }
        })
        .catch( err => {
            console.log(err);
            throw err;    
        })
    })
    .catch(err => {
        console.log(err);
        socket.emit('login-failure',{
            error: "Authorization not successfull",
        })
    }); 
};

const validatePassword = (passwordHash,passwordPlain) => bcrypt.compare(passwordPlain,passwordHash);

const getUserCredentials = user => {
    const username = user.username;
    return db
        .query(`SELECT password FROM login WHERE username='${username}'`)
        .then( (res) => {
            const userFound = res.rows.length > 0;
            return {username:username, password: userFound? res.rows[0].password : null}
            })
        .catch ( err => console.log(err.message))
}

exports.login_http = login_http;
exports.login_socket = login_socket;