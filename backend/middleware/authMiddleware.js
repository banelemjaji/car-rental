import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to verify token & attach user data to req
export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.startsWith("Bearer") 
    ? req.headers.authorization.split(" ")[1] 
    : null;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Auth error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please log in again" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to ensure user is an admin
export const admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied, admin only" });
  }

  next();
};
