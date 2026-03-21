const express = require("express");

const app = express();

app.get("/backup", (req, res) => {
  res.type("text/plain").send(
    [
      "backup-2026-03-10.sql.gz",
      "admin_notes.txt",
      "FLAG{internal-files-only-reachable-via-pivot}"
    ].join("\n")
  );
});

app.get("/admin_notes.txt", (req, res) => {
  res.type("text/plain").send("Service is internal only. Pair SSRF or command injection with this host.\n");
});

app.get("/health", (req, res) => {
  res.send("ok");
});

app.listen(5000, () => {
  console.log("archives listening on 5000");
});
