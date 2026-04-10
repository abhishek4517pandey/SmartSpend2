import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { initializeCronJobs } from "./services/cronJobs.js";

import expenseRoutes from "./routes/expenseRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import splitRoutes from "./routes/splitRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";

// Load environment variables from .env
dotenv.config();

// DEBUG: print MONGO_URI to make sure .env is working
console.log("MONGO_URI from .env:", process.env.MONGO_URI);

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("SmartSpend API running");
});

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/split-expenses", splitRoutes);
app.use("/api/emails", emailRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Initialize cron jobs
  initializeCronJobs();
});