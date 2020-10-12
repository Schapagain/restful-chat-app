


const getChat = (req,res,next) => {
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
    
};

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

const addChat = (req,res,next) => {
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

};

exports.getChat = getChat;
exports.addChat = addChat;