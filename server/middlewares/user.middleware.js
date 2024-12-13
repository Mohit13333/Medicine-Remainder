import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware to authenticate the user
export const authUser = (req, res, next) => {
  const token =
    req.cookies.access_token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token is required" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      console.error("Token verification error:", err); 
      return res.status(403).json({ message: "Invalid access token" });
    }
    
    req.userId = user.id;  // Set user ID from the token payload
    req.user = user;       // Set the entire user object from the token payload
    next();                // Proceed to the next middleware
  });
};

// Middleware to check if the user is an admin
export const authAdmin = async (req, res, next) => {
  try {
    const userId = req.userId; // Access userId set in authUser middleware
    console.log("userId: " + userId); // Log userId for debugging

    if (!userId) {
      return res.status(403).json({ message: "User ID not found" });
    }

    const user = await User.findById(userId);
    console.log(user); // Log user details for debugging

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Permission denied: Admin role required",
      });
    }

    next(); // Proceed to the next middleware
  } catch (error) {
    console.error("Error in authAdmin:", error); // Log any errors that occur
    res.status(403).json({ message: "Access denied" });
  }
};
