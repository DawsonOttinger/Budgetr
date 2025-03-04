import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	middleInitial: { type: String },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	otp: { type: String },
	otpExpires: { type: Date },
	isVerified: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

export default User;

