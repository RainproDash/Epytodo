const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET

exports.genToken = function(id) {
    return jwt.sign({id:id}, secret, { expiresIn: '1h' });
}

exports.verifyToken = function(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ "msg": "No token, authorization denied" });
    }
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ "msg": "Token is not valid" });
        } else {
            req.decoded = decoded;
            next();
        }
      });
}