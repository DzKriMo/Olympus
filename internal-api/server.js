const express = require("express");

const app = express();

app.get("/metadata", (req, res) => {
  res.json({
    service: "oracle",
    environment: "lab-only",
    apiKey: "INTERNAL-ONLY-KEY-91827",
    note: "This endpoint is intentionally not published to the host network."
  });
});

app.get("/health", (req, res) => {
  res.send("ok");
});

app.listen(4000, () => {
  console.log("internal-api listening on 4000");
});
