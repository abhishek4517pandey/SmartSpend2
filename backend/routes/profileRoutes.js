import express from "express";
import Profile from "../models/Profile.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET profile for authenticated user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    res.json(profile);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// POST create or update profile for authenticated user
router.post("/", authMiddleware, async (req, res) => {
  try {
    const data = req.body;
    let profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      Object.assign(profile, { ...data, user: req.user._id });
      await profile.save();
    } else {
      profile = new Profile({ ...data, user: req.user._id });
      await profile.save();
    }

    res.json(profile);
  } catch (err) {
    console.error("Error saving profile:", err);
    res.status(400).json({ message: "Error saving profile" });
  }
});

export default router;