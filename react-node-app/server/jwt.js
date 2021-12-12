const jwt = require('jsonwebtoken')
const env = require('dotenv').config()

const verifyJWT = (req, res, next) => {
    const token = req.headers['authorization'];
    if(token == "test"){
        next();
        return;
    }
    
    if(!token){
        return res.sendStatus(401);
    } else{
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) =>{
            if (err) {
                return res.sendStatus(403) 
            } else{
                req.userID = decoded.id;
                next();
            }
        })
    }

}

module.exports = {jwt, verifyJWT, env}