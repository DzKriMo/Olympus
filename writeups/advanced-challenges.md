# Writeup: Advanced Mission Challenges

This guide covers the advanced stages of the Olympus campaign, focusing on trust abuse, token forgery, and remote code execution.

---

## Golden Fleece Forgery (JWT)
**Objective:** Forge a JWT to gain administrative access.
**Vulnerability:** The application trusts JWTs with the `alg: none` header.
**Solution:** 
1. Get a sample token from the `/token-lab`.
2. Base64 decode the header and change `"alg": "HS256"` (if present) to `"alg": "none"`.
3. Base64 decode the payload and change `"role": "user"` to `"role": "admin"`.
4. Re-encode both parts and append a trailing dot (to represent an empty signature).
5. Use the forged token in the `Authorization: Bearer <token>` header to access `/api/admin/reports`.

---

## The Trojan Horse (CSRF)
**Objective:** Trick an administrator into performing an action (like toggling maintenance).
**Vulnerability:** The `/admin/toggle-maintenance` endpoint uses GET and lacks CSRF protection.
**Solution:** Induce an admin to click a link or visit a page that triggers an `img` tag or hidden form pointing to `/admin/toggle-maintenance?enabled=on`.

---

## Prometheus's Gift (Insecure Deserialization / RCE)
**Objective:** Execute arbitrary code via the profile importer.
**Vulnerability:** The importer uses `new Function()` on a base64-encoded JSON payload's `hook` property.
**Solution:** Craft a payload containing a malicious hook.
**Payload:**
```json
{
  "profile": "attacker",
  "hook": "return process.mainModule.require('child_process').execSync('id').toString()"
}
```
Base64 encode this and submit to `/api/import-profile`.

---

## Oracle's Vision (Server-Side Template Injection)
**Objective:** Gain RCE or leak secrets via template rendering.
**Vulnerability:** The template renderer uses tagged templates with a `with` statement and `new Function()`.
**Solution:** Inject a template expression to access the `helpers` object or the `process` object.
**Payload:** `${helpers.readFile('.env')}` or `${helpers.rootFlag()}`
**Explanation:** The renderer provides a `helpers` object directly to the template context.

---

## Iris's Bridge Escalation (WebSocket Auth Bypass)
**Objective:** Gain admin privileges on the WebSocket link.
**Vulnerability:** The WebSocket server trusts the `role` parameter provided in the connection query string.
**Solution:** Connect with `ws://localhost:3000/ws?role=admin`.
**Exploit:** Once connected as admin, send `{ "type": "admin:dumpSecrets" }` to retrieve flags.

---

## Gateway to Tartarus (Lateral Movement)
**Objective:** Pivot from the foothold to the legacy internal target.
**Vulnerability:** Use findings from SSRF and CMDi (like credentials found in backups) to access services on the `tartarus` host (simulated via internal pivots).
**Solution:** Use the `archives` or `forge` exports to find credentials for the legacy host and access it via SSRF or CMDi.
