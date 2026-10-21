import { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import { rateLimit } from "../middleware/rateLimit.js";

const router = Router();

const authRateLimit = rateLimit({ windowMs: 60_000, maxRequests: 10 });
router.post("/register", authRateLimit, registerUser);
router.post("/login", authRateLimit, loginUser);

export default router;
