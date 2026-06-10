const express = require("express");
const cors = require("cors");
const path = require("path");
const { processGraph } = require("./api/graph");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// POST /api/graph
app.post("/api/graph", (req, res) => {
  const { edges } = req.body;

  if (!edges || !Array.isArray(edges)) {
    return res.status(400).json({ error: "Request body must include an 'edges' array." });
  }

  try {
    const result = processGraph(edges);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Serve frontend for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
