const express = require("express");
const net = require("net");

const app = express();
app.use(express.urlencoded({ extended: true }));

const difficulty = String(process.env.LAB_DIFFICULTY || "medium").toLowerCase();
const machine = process.env.LAB_MACHINE || "Olympus";
const slug = machine.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const profiles = {
  easy: {
    backupUser: "backup",
    backupPass: "backup123",
    opsUser: "ops",
    opsPass: "ops123",
    overseerHint: "Use the backup operator credentials on the old ports too."
  },
  medium: {
    backupUser: "backup",
    backupPass: "backup123",
    opsUser: "ops",
    opsPass: "ops123",
    overseerHint: "Port 2222 still trusts ancient operator passwords."
  },
  hard: {
    backupUser: "archivist",
    backupPass: "riverstyx!",
    opsUser: "ferryman",
    opsPass: "Ch4r0n!",
    overseerHint: "Operators renamed the accounts but reused the same workflow."
  },
  nightmare: {
    backupUser: "vaultsvc",
    backupPass: "LetMeIn?Nope",
    opsUser: "gatekeeper",
    opsPass: "Abyss4Ever!",
    overseerHint: "The old names are gone; credentials survive only in internal traces."
  }
};

const active = profiles[difficulty] || profiles.medium;

app.get("/", (req, res) => {
  res.send(`
    <h1>Vault of Tartarus</h1>
    <p>Machine: ${machine}</p>
    <p>Difficulty: ${difficulty}</p>
    <p>This ancient machine still hums with the echoes of forgotten protocols.</p>
    <ul>
      <li>Stygian Shell on port 2222</li>
      <li>Hermes Transfer on port 2121</li>
      <li>Ancient Overseer Panel on port 8081</li>
    </ul>
  `);
});

app.get("/admin", (req, res) => {
  const { user, pass } = req.query;
  if (user === active.backupUser && pass === active.backupPass) {
    return res.type("text/plain").send(
      [
        "tartarus ancient overseer",
        "stored_offerings=/srv/archives",
        `overseer_user=${active.opsUser}`,
        `overseer_hint=${active.overseerHint}`,
        `FLAG{${slug}-${difficulty}-overseer-open}`
      ].join("\n")
    );
  }

  res.status(401).type("text/plain").send("unauthorized");
});

app.get("/health", (req, res) => {
  res.send("ok");
});

app.listen(8081, () => {
  console.log(`legacy-host http listening on 8081 (${difficulty})`);
});

const sshServer = net.createServer((socket) => {
  socket.write("SSH-2.0-StyxServer_1.0\r\n");
  socket.write("tartarus login as: ");

  let stage = "user";
  let username = "";

  socket.on("data", (chunk) => {
    const input = chunk.toString("utf8").trim();

    if (stage === "user") {
      username = input;
      stage = "pass";
      socket.write("password: ");
      return;
    }

    if (stage === "pass") {
      if (username === active.opsUser && input === active.opsPass) {
        stage = "shell";
        socket.write(`\nWelcome to the depths of Tartarus (${difficulty}).\n$ `);
      } else {
        socket.write("\nAuthentication failed.\n");
        socket.end();
      }
      return;
    }

    if (stage === "shell") {
      if (input === "help") {
        socket.write("Commands: help, whoami, ls /srv/backups, cat /flag, exit\n$ ");
        return;
      }

      if (input === "whoami") {
        socket.write(`${active.opsUser}\n$ `);
        return;
      }

      if (input === "ls /srv/backups") {
        socket.write("db-2026-03-10.sql.gz\nmail-archive.tar\n$ ");
        return;
      }

      if (input === "cat /flag") {
        socket.write(`FLAG{${slug}-${difficulty}-legacy-shell}\n$ `);
        return;
      }

      if (input === "exit") {
        socket.end("logout\n");
        return;
      }

      socket.write("command not found\n$ ");
    }
  });
});

sshServer.listen(2222, () => {
  console.log(`legacy-host ssh simulation listening on 2222 (${difficulty})`);
});

const ftpServer = net.createServer((socket) => {
  socket.write("220 Tartarus FTP gateway ready\r\n");
  let username = "";
  let authenticated = false;

  socket.on("data", (chunk) => {
    const input = chunk.toString("utf8").trim();

    if (/^USER\s+/i.test(input)) {
      username = input.split(/\s+/, 2)[1];
      socket.write("331 Password required\r\n");
      return;
    }

    if (/^PASS\s+/i.test(input)) {
      const password = input.split(/\s+/, 2)[1];
      authenticated = username === active.backupUser && password === active.backupPass;
      socket.write(authenticated ? "230 Login successful\r\n" : "530 Login incorrect\r\n");
      return;
    }

    if (/^LIST$/i.test(input)) {
      socket.write("150 Opening ASCII mode data connection\r\nbackup.zip\r\nnotes.txt\r\n226 Transfer complete\r\n");
      return;
    }

    if (/^RETR\s+flag.txt$/i.test(input)) {
      const flag = authenticated
        ? `FLAG{${slug}-${difficulty}-legacy-ftp}`
        : "Authentication required";
      socket.write(`150 Opening data connection\r\n${flag}\r\n226 Transfer complete\r\n`);
      return;
    }

    if (/^QUIT$/i.test(input)) {
      socket.end("221 Goodbye\r\n");
      return;
    }

    socket.write("200 Command okay\r\n");
  });
});

ftpServer.listen(2121, () => {
  console.log(`legacy-host ftp simulation listening on 2121 (${difficulty})`);
});
