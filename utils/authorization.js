
const njwt = require('njwt');
const { request } = require('../app');
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
      res.status(401).json({
          message: "Unauthorized",
      })
    }
}

module.exports = {getAuthToken,verifyAuthToken};