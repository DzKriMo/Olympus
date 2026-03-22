# Olympus: HTB-Style Web Security Playground


Olympus is an intentionally vulnerable multi-container lab for local web exploitation practice. It behaves like a small Hack The Box style machine: you start from a public web app, pivot into internal services, reach a legacy side host, and work through chained bugs until you claim `user` and `root`.

## What is in the lab

- `the-great-hall` on `http://localhost:3000`: the public target and mission hub
- `oracle` on `4000` internally: SSRF/recon target
- `archives` on `5000` internally: backup mirror and pivot clues
- `forge` on `7000` internally: ops export service with internal breadcrumbs
- `tartarus` on `8081`, `2121`, `2222`: legacy HTTP/FTP/SSH-style post-foothold target

## Vulnerability surface

- SQL injection
- IDOR
- Stored XSS
- SSRF
- Command injection
- Path traversal
- Unsigned JWT acceptance
- CSRF
- Unsafe import hook execution
- Server-side template injection
- Weak WebSocket authorization
- Lateral movement into a legacy host

## Difficulty modes

The same machine can be started in different runtime tiers. The tier changes seeded credentials, hint visibility, some service responses, and the amount of hand-holding.

- `easy`: loud hints, weak creds, ideal for demos
- `medium`: default balance
- `hard`: fewer hints, rotated creds, more HTB-like
- `nightmare`: minimal guidance, same exploit surface, much less help

## Running it

Default:

```powershell
docker compose up --build
```

Easy:

```powershell
$env:LAB_DIFFICULTY="easy"
docker compose up --build
```

Hard:

```powershell
$env:LAB_DIFFICULTY="hard"
docker compose up --build
```

Nightmare with a custom machine name:

```powershell
$env:LAB_DIFFICULTY="nightmare"
$env:LAB_MACHINE="Medusa"
docker compose up --build
```

Open `http://localhost:3000` after the stack starts.

## Notes about changing difficulty

- Difficulty is injected through Docker Compose environment variables.
- If you want a completely clean run when switching tiers, remove the compose volumes first:

```powershell
docker compose down -v
```

- The app reseeds the core machine users and hints on boot, but clearing volumes is still the cleanest way to reset progress.

## Machine flow

The lab is structured as a chained machine instead of isolated toy bugs:

1. Recon and foothold: SQLi, IDOR, XSS, traversal
2. Internal pivot: SSRF, command injection, Tartarus access
3. Trust abuse: JWT forgery and CSRF
4. Crown the box: import hook abuse, SSTI, WebSocket trust

Complete stages 1-2 to reveal the `user` flag. Complete every stage to reveal the `root` flag.

## Useful in-app endpoints

- `/machine`: machine profile and stage path
- `/missions`: individual mission status
- `/campaign`: stage progression and flag reveal state
- `/telemetry`: recent activity log
- `/api/machine`: machine metadata
- `/api/score`: scoring summary
- `/api/export`: full campaign export

## Starter creds

`easy` mode intentionally exposes multiple starting credentials.

`medium` mode reveals only `guest / guest`.

`hard` and `nightmare` expect you to earn credentials through the machine itself.

## Verification

The service entrypoints were syntax-checked with:

```powershell
node --check app\server.js
node --check internal-api\server.js
node --check internal-files\server.js
node --check legacy-host\server.js
node --check ops-console\server.js
```

## Safety

This is a local research environment. Do not expose it to untrusted networks.
