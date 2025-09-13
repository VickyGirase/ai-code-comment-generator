import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();

// ✅ CORS setup
app.use(cors({
  origin: [
    "http://localhost:3000",               // local React dev
    "https://ai-code-comment-generator-2.onrender.com" // deployed frontend
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// Routes
app.use("/api", aiRoutes);

// 👉 Export the app for both serverless + local use
export default app;
