const jwt = require('jsonwebtoken')
const env = require('dotenv').config()

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]

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