const express = require("express");

const app = express();

const difficulty = String(process.env.LAB_DIFFICULTY || "medium").toLowerCase();
const machine = process.env.LAB_MACHINE || "Olympus";
const slug = machine.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const archiveHints = {
  easy: "User foothold usually comes from chaining SSRF into the archive mirror.",
  medium: "Pair SSRF or command injection with this host.",
  hard: "Archive mirror remains internal. Assume the public edge should not know about it.",
  nightmare: "No direct clues. Internal pivot required."
};

app.get("/backup", (req, res) => {
  res.type("text/plain").send(
    [
      "backup-2026-03-10.sql.gz",
      "admin_notes.txt",
      `FLAG{${slug}-${difficulty}-archive-pivot}`,
      archiveHints[difficulty] || archiveHints.medium
    ].join("\n")
  );
});

app.get("/admin_notes.txt", (req, res) => {
  res.type("text/plain").send(
    [
      `machine=${machine}`,
      `difficulty=${difficulty}`,
      "service=archives",
      archiveHints[difficulty] || archiveHints.medium
    ].join("\n")
  );
});

app.get("/health", (req, res) => {
  res.send("ok");
});

app.listen(5000, () => {
  console.log(`archives listening on 5000 (${difficulty})`);
});
