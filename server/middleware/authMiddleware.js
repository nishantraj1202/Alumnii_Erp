const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  // Check if the token follows Bearer scheme
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Invalid token format. Use Bearer scheme." });
  }

  // Extract the token without 'Bearer ' prefix
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    // Provide more specific error messages based on the error type
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token has expired" });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token signature" });
    }
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;