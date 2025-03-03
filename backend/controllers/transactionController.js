import Transaction from "../models/Transaction.js";

export const addTransaction = async (req, res) => {
	try {
		const { type, category, amount, description, date } = req.body;

		if (!type || !category || !amount) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const transaction = new Transaction({
			user: req.user.id,
			type,
			category,
			amount,
			description,
			date,
		});

		await transaction.save();
		res.status(201).json(transaction);
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

export const getTransactions = async (req, res) => {
	try {
		const transactions = await Transaction.find({ user: req.user.id }).sort({
			date: -1,
		});
		res.status(200).json(transactions);
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

export const deleteTransaction = async (req, res) => {
	try {
		const transaction = await Transaction.findById(req.params.id);

		if (!transaction) {
			return res.status(404).json({ message: "Transaction not found" });
		}

		if (transaction.user.toString() !== req.user.id) {
			return res.status(403).json({ message: "Unauthorized" });
		}

		await transaction.remove();
		res.status(200).json({ message: "Transaction deleted" });
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};
