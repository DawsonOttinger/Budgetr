import express from "express";
import Budget from "../models/budgetModel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

//  Save or Update Budget
router.post("/save", authenticateUser, async (req, res) => {
  try {
    const { budget, monthlyIncome } = req.body;

    let userBudget = await Budget.findOne({ userId: req.userId });

    if (userBudget) {
      userBudget = await Budget.findOneAndUpdate(
        { userId: req.userId },
        { ...budget, monthlyIncome },
        { new: true }
      );
    } else {
      userBudget = new Budget({ userId: req.userId, ...budget, monthlyIncome });
      await userBudget.save();
    }

    res.status(200).json({ message: "Budget saved successfully", budget: userBudget });
  } catch (error) {
    console.error("Error saving budget:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//  Retrieve Budget
router.get("/get", authenticateUser, async (req, res) => {
	try {
	  const userBudget = await Budget.findOne({ userId: req.userId }).lean();
  
	  if (!userBudget) {
		return res.status(404).json({ message: "No budget found" });
	  }
  
	  const {
		housing, transportation, food, utilities,
		insurance, healthcare, savings, debt,
		personal, entertainment, monthlyIncome
	  } = userBudget;
  
	  res.json({
		housing, transportation, food, utilities,
		insurance, healthcare, savings, debt,
		personal, entertainment, monthlyIncome
	  });
	} catch (error) {
	  console.error("Error retrieving budget:", error);
	  res.status(500).json({ message: "Internal Server Error" });
	}
  });

  export default router;