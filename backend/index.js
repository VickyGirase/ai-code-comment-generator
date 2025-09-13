import serverless from "serverless-http";
import app from "./server.js";

// export serverless handler
export const handler = serverless(app);
