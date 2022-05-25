const jwt = require('jsonwebtoken');
const appConfig = require('../config/env');
const { JWT_SECRET_KET, JWT_EXPIRATION } = appConfig;

const checkToken = (req, res, next) => {
    const header = req.headers.token;
    if (typeof header !== 'undefined') {
        const bearer = header.split('Bearer ');
        const token = bearer[1]
        req.token = token
        next();
    } else
        res.status(401).json({
            error: "Unauthorized. Please provide valid access token",
            status: false,
        })
}

const signJWT = (data) => {
    const token = jwt.sign({
        data
    }, JWT_SECRET_KET, { expiresIn: JWT_EXPIRATION })

    return token;
}

module.exports = { checkToken, signJWT }