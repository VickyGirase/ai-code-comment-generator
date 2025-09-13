import express from "express";
import dotenv from "dotenv";
import cors from "cors";   // 👈 new import
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();

// ✅ CORS allow karo
app.use(cors({
  origin: "http://localhost:3000",  // tumhara React app ka URL
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// Routes
app.use("/api", aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});