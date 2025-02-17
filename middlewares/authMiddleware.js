// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');

//   if (!token) {
//     return res.status(401).json({ message: 'Access Denied: No token provided' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Add the decoded token payload to the request object
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Access Denied: Invalid token' });
//   }
// };

// module.exports = authMiddleware;

const jwt = require("jsonwebtoken");
const UserModel = require("../models/User"); 


// Middleware to verify token and authorize access
 const authMiddleware = (allowedRoles = [], allowedPermissions = []) => {
  return async (req, res, next) => {
    try {
      // Get token from headers
      const token = req.header("Authorization")?.split(" ")[1]; // Format: "Bearer <token>"
      if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach user details to request object
      console.log(decoded)

      const existingUser = await UserModel.findOne({email: decoded.userEmail  });
      console.log('byemail ' , existingUser)
      
      // Fetch user from database to check role & permissions
      const user = await UserModel.findById(decoded.userId);
      console.log("user", user)
      if (!user) {
        return res.status(401).json({ message: "User not found." });
      }

      // Check if user role is allowed
      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden: Insufficient role privileges." });
      }

      // if (user.role === 'user' && allowedPermissions.length) {
      //   const hasPermission = allowedPermissions.every((perm) => user.permissions.includes(perm));
      //   if (!hasPermission) {
      //     return res.status(403).json({ message: "Forbidden: Insufficient permissions." });
      //   }
      // }

      // Attach user details to request for further use
      req.user = {
        id: user._id,
        username: user.username,
        role: user.role,
        permissions: user.permission,
      };

      next(); // Proceed to next middleware or route handler
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token.", error: error.message });
    }
  };
};

module.exports = { authMiddleware };
