// Complete Aureon Backend Server
// Provides: /api/aureon/message, /api/aureon/memory, /api/aureon/profile, /api/aureon/health
// Connects the AureonKernel to an HTTP API.
// Fully runnable Node.js backend with Express.

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const {
  AureonKernel,
  createAureonKernel,
  MemoryService,
  ProfileService,
  SafetyService,
  DefaultLlmClient
} = require("./aureon-kernel");

// Create core services
const memoryService = new MemoryService();
const profileService = new ProfileService();
const safetyService = new SafetyService();
const llmClient = new DefaultLlmClient();

// Create Aureon kernel instance
const kernel = new AureonKernel({
  memoryService,
  profileService,
  safetyService,
  llmClient,
  logger: { log: (...args) => console.log(...args) }
});

////////////////////////////////////////////////////////////////////////////////
// Server Setup
////////////////////////////////////////////////////////////////////////////////

const app = express();
app.use(cors());
app.use(bodyParser.json());

////////////////////////////////////////////////////////////////////////////////
// API: /api/aureon/message
// Processes a user message through Aureon's π → φ → e pipeline.
////////////////////////////////////////////////////////////////////////////////

app.post("/api/aureon/message", async (req, res) => {
  try {
    const { userId, message, mode } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        error: { message: "Missing userId or message", code: "INVALID_REQUEST" }
      });
    }

    const response = await kernel.run({ userId, message, mode });

    res.json({
      reply: response.text,
      metrics: response.metrics,
      memoryWrites: response.memoryWrites,
      safetyFlags: response.safetyFlags,
      mode: mode || profileService.load(userId).mode
    });
  } catch (err) {
    console.error("Error in /api/aureon/message:", err);
    res.status(500).json({
      error: { message: "Internal server error", code: "INTERNAL_ERROR" }
    });
  }
});

////////////////////////////////////////////////////////////////////////////////
// API: /api/aureon/memory
// Returns LTM entries for transparency.
////////////////////////////////////////////////////////////////////////////////

app.get("/api/aureon/memory", (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: { message: "Missing userId", code: "INVALID_REQUEST" } });
  }

  const entries = memoryService.load(userId);
  res.json({ entries });
});

////////////////////////////////////////////////////////////////////////////////
// API: DELETE /api/aureon/memory/:id
// Deletes a single memory entry by index.
////////////////////////////////////////////////////////////////////////////////

app.delete("/api/aureon/memory/:id", (req, res) => {
  const { userId } = req.query;
  const id = parseInt(req.params.id, 10);

  if (!userId || isNaN(id)) {
    return res.status(400).json({ error: { message: "Invalid request", code: "INVALID_REQUEST" } });
  }

  const entries = memoryService.load(userId);
  if (!entries[id]) {
    return res.status(404).json({ error: { message: "Memory not found", code: "MEMORY_NOT_FOUND" } });
  }

  entries.splice(id, 1);
  res.json({ deleted: true });
});

////////////////////////////////////////////////////////////////////////////////
// API: DELETE /api/aureon/memory/all
// Clears all LTM entries.
////////////////////////////////////////////////////////////////////////////////

app.delete("/api/aureon/memory/all", (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: { message: "Missing userId", code: "INVALID_REQUEST" } });
  }

  memoryService.store[userId] = [];
  res.json({ deleted: "all" });
});

////////////////////////////////////////////////////////////////////////////////
// API: /api/aureon/profile
// Returns the user profile (mode, tone, depth)
////////////////////////////////////////////////////////////////////////////////

app.get("/api/aureon/profile", (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: { message: "Missing userId", code: "INVALID_REQUEST" } });
  }

  const profile = profileService.load(userId);
  res.json(profile);
});

////////////////////////////////////////////////////////////////////////////////
// API: POST /api/aureon/profile/update
// Updates profile preferences.
////////////////////////////////////////////////////////////////////////////////

app.post("/api/aureon/profile/update", (req, res) => {
  const { userId, preferences } = req.body;

  if (!userId || !preferences) {
    return res.status(400).json({ error: { message: "Invalid request", code: "INVALID_REQUEST" } });
  }

  const updated = profileService.update(userId, preferences);
  res.json({ updated: true, profile: updated });
});

////////////////////////////////////////////////////////////////////////////////
// API: /api/aureon/health
// Basic health check endpoint.
////////////////////////////////////////////////////////////////////////////////

app.get("/api/aureon/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

////////////////////////////////////////////////////////////////////////////////
// API: /api/aureon/kernel-status
// Displays simple debugging info.
////////////////////////////////////////////////////////////////////////////////

app.get("/api/aureon/kernel-status", (req, res) => {
  res.json({
    kernel: "running",
    memoryUsers: Object.keys(memoryService.store).length,
    profileUsers: Object.keys(profileService.profiles).length,
    llm: "default-stub"
  });
});

////////////////////////////////////////////////////////////////////////////////
// Server Start
////////////////////////////////////////////////////////////////////////////////

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Aureon backend server running on port ${PORT}`);
});

////////////////////////////////////////////////////////////////////////////////
// End of file
////////////////////////////////////////////////////////////////////////////////
