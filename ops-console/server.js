const express = require("express");

const app = express();

const difficulty = String(process.env.LAB_DIFFICULTY || "medium").toLowerCase();
const machine = process.env.LAB_MACHINE || "Olympus";

const exportsByDifficulty = {
  easy: [
    "config/.env",
    "backups/users.sql",
    "legacy/creds.txt",
    "Hint: overseer panel keeps backup credentials close to the HTTP layer."
  ],
  medium: [
    "config/.env",
    "backups/users.sql",
    "legacy/creds.txt",
    "FLAG{ops-console-reachable-from-internal-network}"
  ],
  hard: [
    "config/.env",
    "backups/nightly.tar.gz",
    "ops/runbooks/tartarus.md",
    "Legacy host checks still depend on backup operators."
  ],
  nightmare: [
    "config/.env",
    "ops/runbooks/tartarus.md",
    "nightly/export-manifest.json",
    "Pivot first, then enumerate."
  ]
};

app.get("/exports", (req, res) => {
  res.json({
    host: "forge",
    machine,
    difficulty,
    snapshot: "nightly-2026-03-10",
    items: exportsByDifficulty[difficulty] || exportsByDifficulty.medium
  });
});

app.get("/health", (req, res) => {
  res.send("ok");
});

app.listen(7000, () => {
  console.log(`ops-console listening on 7000 (${difficulty})`);
});
