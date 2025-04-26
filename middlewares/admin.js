const jwt = require('jsonwebtoken');
const { JWT_ADMIN_SECRET } = require("../config");

function adminmiddleware(req, res, next) {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decodedtoken = jwt.verify(token, JWT_ADMIN_SECRET);
    req.userId = decodedtoken.id; // ✅ assign properly
    next(); // ✅ go to next route
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
}

module.exports = {
  adminmiddleware
};
