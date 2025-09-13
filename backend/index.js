import serverless from "serverless-http";
import app from "./server.js";

// For Vercel
export const handler = serverless(app);

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server running locally on http://localhost:${PORT}`);
  });
}
