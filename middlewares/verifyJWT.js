const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden: Invalid token' });
            }
            
            if (!decoded || !decoded.UserInfo || !decoded.UserInfo.email || !decoded.UserInfo.role) {
                return res.status(403).json({ message: 'Forbidden: Token payload is invalid' });
            }

            req.email = decoded.UserInfo.email;
            req.role = decoded.UserInfo.role;
            next();
        });
    } catch (error) {
        console.error('Error in JWT verification:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = verifyJWT;