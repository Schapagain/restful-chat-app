
const njwt = require('njwt');
const signingKey = process.env.PRIVATEKEY;

const getAuthToken = username => {
    const claims = {
      sub: username,
    }
    const token = njwt.create(claims,signingKey);
    token.setExpiration(new Date().getTime() + (60*60*1000));
    return token.compact();
}

const verifyAuthToken = (req,res,next) => {
    try{
        const userToken = req.headers.authorization;
        console.log(userToken);
        const token = njwt.verify(userToken,signingKey);
        const tokenUsername = token.body.sub;
        console.log("Token expires in",token.body.exp);
        console.log("Token belongs to",tokenUsername);
        console.log("Trying to access data of",req.params.username);
        if (req.params.username && tokenUsername != req.params.username){
            throw new Error();
        }
        if (req.body.sender && tokenUsername != req.body.sender){
            throw new Error();
        }
        req.username = tokenUsername;
        next();
    }catch(e){
        console.log('authorization error:', e.message);
        res.redirect('/login');
    }
}

const verifyAuthToken_socket = (req,res,next) => {

    try{

        const userToken = req.params.token;
        console.log(userToken);
        const token = njwt.verify(userToken,signingKey);
        const tokenUsername = token.body.sub;
        console.log("Token expires in",token.body.exp);
        console.log("Token belongs to",tokenUsername);
        req.header.username = tokenUsername;
        next();
    }catch(e){
        console.log('authorization error socket:', e);
        res.redirect('/login');
    }
}

const getUsernameFromToken = userToken => {
    try{
      const token = njwt.verify(userToken,process.env.PRIVATEKEY);
      return token.body.sub;
    }catch(e){
      return null;
    }
 }

module.exports = {getAuthToken,verifyAuthToken,verifyAuthToken_socket,getUsernameFromToken};