const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return null;
        }

        return user;
    });
}

const extractTokenFromHeader = (authHeader) => {
    const tokenArray = authHeader && authHeader.split(' ');

    if (!tokenArray || tokenArray.length !== 2 || tokenArray[0].toLowerCase() !== 'bearer') {
        return false;
    }

    return tokenArray[1];
}

const authenticateToken = (req, res, next) => {
    const token = extractTokenFromHeader(req.headers.authorization);
    console.log('req.headers: ', req.headers);
    if (!token) {
        res.status(401).json('Unauthorized: missing token');
    } else {
        const user = verifyToken(token);
        if (!user) {
            res.status(403).json('Forbidden: invalid token');
        } else {
            req.body.email = user.email;
            next();
        }
    }
};

module.exports = {authenticateToken, verifyToken};