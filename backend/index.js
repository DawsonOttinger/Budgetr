import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js"; // ✅ Import authentication routes

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json()); // Allows parsing of JSON requests
app.use(cors()); // Enables Cross-Origin Resource Sharing

// Routes
app.use("/api/auth", authRoutes); // ✅ Use auth routes under /api/auth

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
mongoose
	.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log("✅ MongoDB Connected");
		app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
	})
	.catch((error) => console.error("❌ MongoDB Connection Failed:", error));

