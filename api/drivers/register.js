const path = require('path');
const bcrypt = require('bcrypt');
const appRoot = path.dirname(require.main.filename);
const db = require(appRoot.concat('/db'));

const register_socket = (socket,user) => {
    ({ username, password } = user);
    if (!username || !password) {
        socket.emit('registration-failure',{
            message: "Could not add user",
            error: "Username and password are required"
        });
        return;
    }

    registerUser({ username, password })
        .then(result => {
            initUserProfile(result.username)
            socket.emit('registration-success',{
                message: "User registered successfully",
                result,
            });
        })
        .catch(err => {
            console.log(err);
            socket.emit('registration-failure',{
                message: "Could not add user",
                error: err.message,
            });
        });
};

const register_http = (req,res) => {
    ({ username, password } = req.body);
    if (!username || !password) {
        throw new Error("Username and password are required");
    }

    registerUser({ username, password })
        .then(result => {
            initUserProfile(result.username)
            res.status(201).json({
                message: "User registered successfully",
                result,
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Could not add user",
                error: err.message,
            })
        });
};

const initUserProfile = username => {
    const queryString = "INSERT INTO users (username,firstname,lastname,cellnumber,profilepicture) VALUES ($1,$2,$3,$4,$5)";
    const queryValues = [username, '', '', '', serverAddress.concat('/uploads/dummy.jpeg')];
    return db
        .query(queryString, queryValues)
        .then(result => result.rows[0])
        .catch(err=>console.log(err));
}


const registerUser = user => {
    const newUsername = user.username;

    return checkforDuplicates(newUsername)
        .then(duplicateExists => {
            if (duplicateExists) {
                throw new Error('Username already exists');
            } else {
                return generatePasswordHash(user.password)
                    .then((newPasswordHash) => {
                        const newUser = { username: newUsername, password: newPasswordHash }
                        return addUserCredentials(newUser)
                    })
            }
        });
}

const generatePasswordHash = passwordPlain => {
    const saltRounds = 5;
    return bcrypt
        .hash(passwordPlain, saltRounds);
}

const checkforDuplicates = userName => {
    const queryString = "SELECT username FROM login WHERE username=$1";
    const queryValues = [userName];
    return db
        .query(queryString, queryValues)
        .then(result => result.rowCount > 0);
}

const addUserCredentials = user => {

    const queryString = "INSERT INTO login (username,password) VALUES ($1,$2) RETURNING username";
    const queryValues = [user.username, user.password];
    return db
        .query(queryString, queryValues)
        .then(result => result.rows[0])
}

exports.register_http = register_http;
exports.register_socket = register_socket;