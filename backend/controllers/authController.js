import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (user) => {
	return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req, res) => {
	const { name, email, password } = req.body;

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) return res.status(400).json({ message: "Email already in use" });

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = new User({ name, email, password: hashedPassword });
		await newUser.save();

		res.status(201).json({ user: newUser, token: generateToken(newUser) });
	} catch (error) {
		res.status(500).json({ message: "Something went wrong" });
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ message: "User not found" });

		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) return res.status(400).json({ message: "Invalid credentials" });

		res.status(200).json({ user, token: generateToken(user) });
	} catch (error) {
		res.status(500).json({ message: "Something went wrong" });
	}
};
