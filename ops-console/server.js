const express = require("express");

const app = express();

app.get("/exports", (req, res) => {
  res.json({
    host: "forge",
    snapshot: "nightly-2026-03-10",
    items: [
      "config/.env",
      "backups/users.sql",
      "FLAG{ops-console-reachable-from-internal-network}"
    ]
  });
});

app.get("/health", (req, res) => {
  res.send("ok");
});

app.listen(7000, () => {
  console.log("ops-console listening on 7000");
});
