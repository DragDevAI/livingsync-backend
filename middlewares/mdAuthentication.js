const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyJWT = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ message: "Forbidden - No JWT token" });
    }

    // Verify token
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        return res.status(403).json({ message: "Forbidden - Authentication fails" });
    }
    req.decoded = decoded;
    next();
};