import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "Error", 
        message: "Unauthorized - No token provided" 
      });
    }
    //Bearer eycugdjgslgbclvkngrs
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log(decoded);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        status: "Error", 
        message: "Unauthorized - User not found"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      status: "Error", 
      message: "Unauthorized - Invalid Token" 
    });
  }
};

export const isTeacher = async (req, res, next) => {
  if (req.user?.role !== "teacher") {
    return res.status(403).json({
      message: "Access Denied - You do not have permission to perform this action",
    });
  }
  next();
};
