import { Router } from "express";
import { createDonor, searchDonors } from "../controllers/donorController.js";
import { rateLimit } from "../middleware/rateLimit.js";

const router = Router();

router.get("/search", rateLimit({ windowMs: 60_000, maxRequests: 60 }), searchDonors);
router.post("/search", rateLimit({ windowMs: 60_000, maxRequests: 60 }), searchDonors);
router.post("/", rateLimit({ windowMs: 60 * 60_000, maxRequests: 5 }), createDonor);

export default router;
