const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add the decoded token payload to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Access Denied: Invalid token' });
  }
};

module.exports = authMiddleware;
