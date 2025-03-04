import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

//  Configure Nodemailer for Sending Emails
const transporter = nodemailer.createTransport({
	service: "Gmail",
	auth: {
		user: process.env.EMAIL_USER, // ✅ Your Gmail email
		pass: process.env.EMAIL_PASS, // ✅ Your Gmail App Password
	},
});

// Register User
router.post("/register", async (req, res) => {
	try {
		const { firstName, lastName, middleInitial, email, password } = req.body;

		let user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({ message: "User already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		user = new User({
			firstName,
			lastName,
			middleInitial,
			email,
			password: hashedPassword,
			isVerified: false, // Default to false until email is verified
		});

		await user.save();

		//  Generate and Send OTP
		const otp = crypto.randomInt(100000, 999999).toString();
		user.otp = otp;
		user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes expiration
		await user.save();

		await transporter.sendMail({
			from: process.env.EMAIL_USER,
			to: user.email,
			subject: "Your Budgetr OTP Code",
			text: `Your OTP code is: ${otp}. It expires in 5 minutes.`,
		});

		res.status(201).json({ message: "User registered. OTP sent to email." });
	} catch (error) {
		console.error("❌ Error in /register:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

//  Verify OTP (Email Confirmation)
router.post("/verify-otp", async (req, res) => {
	const { email, otp } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
			return res.status(400).json({ message: "Invalid or expired OTP" });
		}

		user.otp = null;
		user.otpExpires = null;
		user.isVerified = true; // Mark user as verified
		await user.save();

		res.json({ message: "Email verified successfully" });
	} catch (error) {
		console.error("❌ Error in /verify-otp:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

//  Resend OTP
router.post("/send-otp", async (req, res) => {
	const { email } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ message: "No account found for this E-mail address" });
		}

		// Generate a new OTP
		const otp = crypto.randomInt(100000, 999999).toString();
		user.otp = otp;
		user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes expiration
		await user.save();

		await transporter.sendMail({
			from: process.env.EMAIL_USER,
			to: user.email,
			subject: "Your New OTP Code",
			text: `Your new OTP is: ${otp}. It expires in 5 minutes.`,
		});

		res.json({ message: "New OTP sent to email." });
	} catch (error) {
		console.error("❌ Error in /send-otp:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

//  Login User
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ message: "No account found for this E-mail address" });
		}

		if (!user.isVerified) {
			return res.status(403).json({ message: "Please verify your email first before logging in." });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: "Your email and/or password was incorrect. Please try again" });
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
		res.json({ token, userId: user._id });
	} catch (error) {
		console.error("❌ Error in /login:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

// Forgot Password (Send OTP)
router.post("/forgot-password", async (req, res) => {
	const { email } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ message: "No account found for this E-mail address" });
		}

		// Generate OTP
		const otp = crypto.randomInt(100000, 999999).toString();
		user.otp = otp;
		user.otpExpires = Date.now() + 5 * 60 * 1000;
		await user.save();

		await transporter.sendMail({
			from: process.env.EMAIL_USER,
			to: user.email,
			subject: "Your Budgetr Password Reset Code",
			text: `Your OTP code is: ${otp}. It expires in 5 minutes. Use it to log in and reset your password.`,
		});

		res.json({ message: "OTP sent for password reset." });
	} catch (error) {
		console.error("❌ Error in /forgot-password:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

//  Verify OTP and Log In (For Forgot Password)
router.post("/verify-password-reset", async (req, res) => {
	const { email, otp } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
			return res.status(400).json({ message: "Invalid or expired OTP" });
		}

		user.otp = null;
		user.otpExpires = null;
		await user.save();

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
		res.json({ token, userId: user._id, message: "OTP verified, you are logged in." });
	} catch (error) {
		console.error("❌ Error in /verify-password-reset:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

export default router;

