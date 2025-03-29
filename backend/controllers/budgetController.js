import Budget from "../models/budgetModel.js";

// GET user's budget data
export const getBudget = async (req, res) => {
  try {
    const data = await Budget.findOne({ userId: req.user.id });
    res.json(data || { budget: {}, monthlyIncome: 0 });
  } catch (err) {
    console.error("Error fetching budget:", err);
    res.status(500).json({ message: "Failed to fetch budget data." });
  }
};

// SAVE/UPDATE user's budget data
export const saveBudget = async (req, res) => {
  try {
    const { budget, monthlyIncome } = req.body;

    await Budget.findOneAndUpdate(
      { userId: req.user.id },
      { userId: req.user.id, budget, monthlyIncome },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Budget saved successfully" });
  } catch (err) {
    console.error("Error saving budget:", err);
    res.status(500).json({ message: "Failed to save budget data." });
  }
};