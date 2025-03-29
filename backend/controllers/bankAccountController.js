import BankAccount from "../models/BankAccount.js";

export const getAccounts = async (req, res) => {
  try {
    const data = await BankAccount.findOne({ userId: req.user.id });
    res.json(data ? data.accounts : []);
  } catch (err) {
    console.error("Error fetching accounts:", err);
    res.status(500).json({ message: "Failed to retrieve bank accounts" });
  }
};

export const saveAccounts = async (req, res) => {
  try {
    const { accounts } = req.body;
    await BankAccount.findOneAndUpdate(
      { userId: req.user.id },
      { userId: req.user.id, accounts },
      { upsert: true, new: true }
    );
    res.sendStatus(200);
  } catch (err) {
    console.error("Error saving accounts:", err);
    res.status(500).json({ message: "Failed to save bank accounts." });
  }
};