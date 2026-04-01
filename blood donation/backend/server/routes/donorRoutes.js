import { Router } from "express";
import { createDonor, searchDonors } from "../controllers/donorController.js";

const router = Router();

router.get("/search", searchDonors);
router.post("/", createDonor);

export default router;
