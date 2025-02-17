const jwt = require("jsonwebtoken");
const Company = require("../models/Company.js");

 const companyMiddleware = async (req, res, next) => {
  try {
    console.log("Company Middleware Called");

    // Ensure authorization header exists
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    // Extract token from "Bearer <token>"
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access Denied. Invalid token format." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure token contains a valid ID
    if (!decoded.userId) {
      return res.status(400).json({ message: "Invalid token structure." });
    }

    // Fetch company from the database
    const companyUser = await Company.findById(decoded.userId);

    if (!companyUser) {
      return res.status(404).json({ message: "Company not found." });
    }

    // Attach company details to request
    req.company = {
      id: companyUser._id,
      name: companyUser.username,
    };

    next(); // Proceed to next middleware or route handler
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
 module.exports = {companyMiddleware}