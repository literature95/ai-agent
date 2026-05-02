import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
import providersRouter from "./routes/providers.js";
import chatRouter from "./routes/chat.js";
import conversationsRouter from "./routes/conversations.js";
import settingsRouter from "./routes/settings.js";
import promptsRouter from "./routes/prompts.js";
import mcpRouter from "./routes/mcp.js";
import skillsRouter from "./routes/skills.js";
import sessionsRouter from "./routes/sessions.js";
import workspaceRouter from "./routes/workspace.js";
import agentsRouter from "./routes/agents.js";
import openclawRouter from "./routes/openclaw.js";
import hermesRouter from "./routes/hermes.js";
import deeplinkRouter from "./routes/deeplink.js";
import usageRouter from "./routes/usage.js";
import proxyRouter from "./routes/proxy.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes - core
app.use("/api/providers", providersRouter);
app.use("/api/chat", chatRouter);
app.use("/api/conversations", conversationsRouter);
app.use("/api/settings", settingsRouter);

// API routes - migrated from cc-switch
app.use("/api/prompts", promptsRouter);
app.use("/api/mcp", mcpRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/workspace", workspaceRouter);
app.use("/api/agents", agentsRouter);
app.use("/api/openclaw", openclawRouter);
app.use("/api/hermes", hermesRouter);
app.use("/api/deeplink", deeplinkRouter);
app.use("/api/usage", usageRouter);
app.use("/api/proxy", proxyRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("API endpoints:");
  console.log("  Core:");
  console.log("    /api/providers      - Provider management");
  console.log("    /api/chat           - Chat completions");
  console.log("    /api/conversations  - Conversation CRUD");
  console.log("    /api/settings       - App settings");
  console.log("  Migrated from cc-switch:");
  console.log("    /api/prompts        - Custom prompt management");
  console.log("    /api/mcp            - MCP server management");
  console.log("    /api/skills         - Skills management");
  console.log("    /api/sessions       - Session history browser");
  console.log("    /api/workspace      - Workspace file management");
  console.log("    /api/agents         - Agent management");
  console.log("    /api/openclaw       - OpenClaw configuration");
  console.log("    /api/hermes         - Hermes memory management");
  console.log("    /api/deeplink       - Deep link import");
  console.log("    /api/usage          - Usage & cost tracking");
});
