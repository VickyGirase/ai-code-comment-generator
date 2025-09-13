import express from "express";
import { explainCodeSteps, generateComments } from "../controllers/aiController.js";

const router = express.Router();

// routes
router.post("/explain-steps", explainCodeSteps);
router.post("/generate-comments", generateComments);

export default router;   // ✅ default export jaruri hai
