import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Auth middleware: No token provided");
    return res.status(401).json({ message: "Unauthorized: token missing" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Auth middleware: Token received:", token ? "present" : "missing");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Auth middleware: Decoded token:", decoded);
    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) {
      console.log("Auth middleware: User not found for id:", decoded.id);
      return res.status(401).json({ message: "Unauthorized: invalid token" });
    }

    req.user = user;
    console.log("Auth middleware: req.user set to:", req.user.id);
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }
};
