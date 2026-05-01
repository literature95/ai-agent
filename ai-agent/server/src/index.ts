import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
import providersRouter from "./routes/providers.js";
import chatRouter from "./routes/chat.js";
import conversationsRouter from "./routes/conversations.js";
import settingsRouter from "./routes/settings.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/providers", providersRouter);
app.use("/api/chat", chatRouter);
app.use("/api/conversations", conversationsRouter);
app.use("/api/settings", settingsRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
