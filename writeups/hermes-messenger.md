# Writeup: Messenger Hermes (SSRF)

## Objective
Abuse the server-side fetcher to reach internal services that are not exposed to the public internet.

## Vulnerability Detail
The `/fetch` endpoint accepts a user-provided URL and fetches it using the server's identity.

```javascript
const response = await fetch(target);
const text = await response.text();
```

---

## Easy Difficulty
**Protection:** None.
**Solution:** Directly request the internal service by hostname.
**Payload:** `http://oracle:4000/metadata`
**Explanation:** The server can resolve internal Docker hostnames like `oracle`, `archives`, and `forge`.

---

## Medium Difficulty
**Protection:** Blacklist for `localhost` and `127.0.0.1`.
**Solution:** Use the internal hostname or a different IP representation.
**Payload:** `http://oracle:4000/metadata` or `http://0.0.0.0:4000/metadata`
**Explanation:** The blacklist is weak and doesn't account for the actual internal hostnames that the machine is intended to target.

---

## Hard / Nightmare Difficulty
**Protection:** Blacklist for `localhost`, `127.0.0.1`, and internal service names (`oracle`, `archives`, `forge`, `tartarus`).
**Solution:** Use an alternative IP representation, a decimal IP, or a DNS rebinding service.
**Payload:** `http://172.18.0.3:4000/metadata` (assuming this is the internal IP) or `http://2130706433/metadata` (decimal for 127.0.0.1).
**Explanation:** If names are blocked, using the direct container IP or a numeric representation of an IP can often bypass simple string-based blacklists.
