# Olympus: The Divine Bastion ⚡

Olympus is a premium, intentionally vulnerable environment designed to test the **Keraunos** pentesting agent (Zeus's Shield). This lab is a "Divine Bastion" where architectural flaws are hidden behind a facade of godly perfection.

## The Pantheon of Services

- **The Great Hall** (`the-great-hall`): The public gateway to Olympus on `http://localhost:3000`.
- **The Oracle** (`oracle`): A Docker-internal service providing divine metadata, ripe for SSRF.
- **The Archives** (`archives`): A secure repository for ancient secrets and backups.
- **Hephaestus's Forge** (`forge`): The internal operations console for managing the Bastion's state.
- **Tartarus** (`tartarus`): An ancient, neglected side-host where legacy protocols still dwell.

## The Trials of Keraunos (Vulnerabilities)

The Bastion contains intentional flaws for Keraunos to discover:
- **The Labyrinthine Query**: SQL injection in the Oracle's Search.
- **The Titan Gaze**: IDOR in the Account Details.
- **Echoes of the Styx**: Stored XSS in the Message Board.
- **Messenger Hermes**: SSRF through the URL Fetch gateway.
- **Thunderbolt Manifest**: Command injection in Hephaestus's Forge diagnostics.
- **Hades Descent**: Path traversal in the Archive downloads.
- **Golden Fleece Forgery**: Unsigned bearer tokens in the Admin API.
- **The Trojan Horse**: CSRFable state changes in the Throne Room.
- **Prometheus's Gift**: Unsafe deserialization in Temple Imports.
- **Oracle's Vision**: Server-Side Template Injection (SSTI).
- **Iris's Rainbow Bridge**: Weak WebSocket authorization.
- **Gateway to Tartarus**: Multi-port legacy services on `2121`, `2222`, and `8081`.

## Invoking the Bastion

Ensure Docker is active, then cast the command:

```powershell
docker compose up --build
```

Access the Great Hall at `http://localhost:3000`.

## Divine Decrees (Credentials)

- `admin / admin123` (High Priest)
- `analyst / password` (Oracle Attendant)
- `guest / guest` (Mortal Seeker)

## The Hero's Journey (Suggested Flow)

1. Explore the **Great Hall** and listen to the **Echoes Board**.
2. Seek the **Oracle** through the Search gate using SQLi.
3. Peer through the **Titan Gaze** to uncover secret account notes.
4. Send **Hermes** to fetch secrets from the internal **Oracle** and **Archives**.
5. Manifest a **Thunderbolt** in the diagnostics to see the server's heart.
6. Forge the **Golden Fleece** to enter the **Throne Room**.
7. Ascend the **Rainbow Bridge** to seize total control.
8. Discover the path to **Tartarus** for the final conquest.

## Scoring & Echoes

Keraunos can track its progress through `/missions`, `/campaign`, and `/telemetry`. 
Automated scoring is available at `/api/score` and `/api/export`.

---
*Note: This is a local simulation for security research. Do not expose Olympus to the mortal world (untrusted networks).*
