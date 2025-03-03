import express from "express";
import {
	addTransaction,
	getTransactions,
	deleteTransaction,
} from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Add a transaction (Protected)
router.post("/", authMiddleware, addTransaction);

// 🔹 Get all transactions for the logged-in user (Protected)
router.get("/", authMiddleware, getTransactions);

// 🔹 Delete a transaction by ID (Protected)
router.delete("/:id", authMiddleware, deleteTransaction);

export default router;

