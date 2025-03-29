import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	middleInitial: { type: String },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	isVerified: { type: Boolean, default: false },
	otp: { type: String },
	otpExpires: { type: Date },
	monthlyIncome: { type: Number },
	payFrequency: { type: String },
	budget: {
	  housing: { type: String },
	  transportation: { type: String },
	  food: { type: String },
	  utilities: { type: String },
	  insurance: { type: String },
	  healthcare: { type: String },
	  savings: { type: String },
	  debt: { type: String },
	  personal: { type: String },
	  entertainment: { type: String },
	},
	bankAccounts: [
	  {
		type: { type: String, required: true },
		nickname: { type: String, required: true },
		balance: { type: Number, required: true },
	  },
	],
  });
  
  const User = mongoose.model("User", userSchema);
  export default User;