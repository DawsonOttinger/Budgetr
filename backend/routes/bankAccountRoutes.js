import express from "express";
import { getAccounts, saveAccounts } from "../controllers/bankAccountController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get", auth, getAccounts);
router.post("/save", auth, saveAccounts);

export default router;
