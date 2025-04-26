const jwt = require('jsonwebtoken');
const { JWT_USER_SECRET } = require('../config');

function usermiddleware(req, res, next) {
  const token = req.headers.token; // 🔥 Get token from 'token' header

  if (!token) {
    return res.status(401).json({ message: 'Token not provided in headers' });
  }

  try {
    const decoded = jwt.verify(token, JWT_USER_SECRET);
    console.log("DECODED:", decoded);

    req.userId = decoded.id; // ✅ Assuming you signed it with { id: user._id }
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

module.exports = { usermiddleware };
