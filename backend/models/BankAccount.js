import mongoose from "mongoose";

const bankAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  accounts: [
    {
      type: { type: String, enum: ["Checking", "Savings"], required: true },
      nickname: String,
      balance: Number,
    }
  ]
});

const BankAccount = mongoose.model("BankAccount", bankAccountSchema);
export default BankAccount;