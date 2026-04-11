import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash, authProvider: "local" });
    await user.save();

    const token = createToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, profilePicture: user.profilePicture } });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Error registering user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = createToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, profilePicture: user.profilePicture } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error signing in" });
  }
});

/**
 * POST /api/auth/google
 * Google OAuth login/register
 */
router.post("/google", async (req, res) => {
  try {
    const { name, email, profilePicture, googleId } = req.body;
    
    if (!email || !googleId) {
      return res.status(400).json({ message: "Email and googleId are required" });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // Update googleId if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = "google";
        if (profilePicture && !user.profilePicture) {
          user.profilePicture = profilePicture;
        }
        await user.save();
      }
    } else {
      // Create new user
      user = new User({
        name,
        email,
        googleId,
        profilePicture,
        authProvider: "google"
      });
      await user.save();
    }

    const token = createToken(user._id);
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        profilePicture: user.profilePicture 
      } 
    });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(500).json({ message: "Error with Google authentication" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  res.json({ user: req.user });
});

export default router;
