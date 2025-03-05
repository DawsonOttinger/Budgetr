import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	housing: { type: Number, default: 0 },
	transportation: { type: Number, default: 0 },
	food: { type: Number, default: 0 },
	utilities: { type: Number, default: 0 },
	insurance: { type: Number, default: 0 },
	healthcare: { type: Number, default: 0 },
	savings: { type: Number, default: 0 },
	debt: { type: Number, default: 0 },
	personal: { type: Number, default: 0 },
	entertainment: { type: Number, default: 0 },
	monthlyIncome: { type: Number, required: true },
	payFrequency: { type: String, enum: ["weekly", "biweekly", "monthly", "military"], required: true },
}, { timestamps: true });

export default mongoose.model("Budget", BudgetSchema);

