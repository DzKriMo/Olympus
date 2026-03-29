# Writeup: Thunderbolt Manifest (Command Injection)

## Objective
Execute arbitrary operating system commands on the server via the diagnostics tool.

## Vulnerability Detail
The `/diagnostics` endpoint uses `exec` to run a shell command with user-controlled input.

```javascript
exec(`echo Checking ${host}`, { cwd: __dirname }, (error, stdout, stderr) => { ... });
```

---

## Easy Difficulty
**Protection:** None.
**Solution:** Use command separators to append your own command.
**Payload:** `localhost; whoami`
**Explanation:** The shell executes `echo Checking localhost` followed by `whoami`.

---

## Medium Difficulty
**Protection:** Blacklist for `;`, `&`, and `|`.
**Solution:** Use a newline character (`%0a`) as a command separator.
**Payload:** `localhost%0awhoami`
**Explanation:** Many shells treat a newline as the end of a command, allowing the injection of a second command even when common separators are blocked.

---

## Hard / Nightmare Difficulty
**Protection:** Strict alphanumeric check (`/^[a-zA-Z0-9.\-]+$/`).
**Solution:** This implementation is substantially more secure. To bypass, you would need to find a way to break the regex or use a different parameter. In the context of this playground, the vulnerability might be moved to a different header or require a different approach like argument injection (though less likely here).
**Note:** On Hard, this specific entry point is effectively closed, forcing the attacker to look for other foothold paths (e.g., Traversal or SSRF).
