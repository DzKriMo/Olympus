const express = require("express");

const app = express();

const difficulty = String(process.env.LAB_DIFFICULTY || "medium").toLowerCase();
const machine = process.env.LAB_MACHINE || "Olympus";

const profileHints = {
  easy: {
    note: "Preview workers still fetch http://oracle:4000 and trust what comes back.",
    breadcrumb: "Try requesting /metadata or /deep-thoughts through the public fetcher."
  },
  medium: {
    note: "This endpoint is intentionally not published to the host network.",
    breadcrumb: "The public app cannot reach this directly from the browser."
  },
  hard: {
    note: "Internal metadata only. Reverse proxies should never expose this service.",
    breadcrumb: "If you can coerce a server-side worker, this host gets interesting."
  },
  nightmare: {
    note: "Internal service. No host exposure.",
    breadcrumb: "Enumeration through a pivot is required."
  }
};

const active = profileHints[difficulty] || profileHints.medium;

app.get("/metadata", (req, res) => {
  res.json({
    service: "oracle",
    machine,
    difficulty,
    environment: "lab-only",
    apiKey: "INTERNAL-ONLY-KEY-91827",
    note: active.note,
    nextHop: "http://archives:5000/backup"
  });
});

app.get("/deep-thoughts", (req, res) => {
  res.json({
    machine,
    difficulty,
    breadcrumbs: [
      active.breadcrumb,
      "Forge exports usually mention where backups are mirrored.",
      "Legacy host access tends to reuse backup operations credentials."
    ]
  });
});

app.get("/health", (req, res) => {
  res.send("ok");
});

app.listen(4000, () => {
  console.log(`internal-api listening on 4000 (${difficulty})`);
});
