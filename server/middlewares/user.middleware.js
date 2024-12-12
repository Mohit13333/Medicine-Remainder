import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authUser = (req, res, next) => {
  const token =
    req.cookies.access_token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token is required" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      console.error("Token verification error:", err); // Log the error for debugging
      return res.status(403).json({ message: "Invalid access token" });
    }
    req.user = user; // Attach user information to the request object
    next();
  });
};

export const authAdmin = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (user.role !== "ADMIN") {
      return res.status(400).json({
        message: "Permission denial",
        error: true,
        success: false,
      });
    }

    next();
  } catch {
    res.status(403).json({ message: "Access denied" });
  }
};
