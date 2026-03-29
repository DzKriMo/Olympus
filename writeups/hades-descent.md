# Writeup: The Hades Descent (Path Traversal)

## Objective
Read sensitive local files from the server's filesystem by traversing outside the intended storage directory.

## Vulnerability Detail
The `/download` endpoint takes a file path from the user and passes it directly to `fs.readFileSync` after joining it with a base directory.

```javascript
const targetPath = path.join(__dirname, "files", requested);
const contents = fs.readFileSync(targetPath, "utf8");
```

---

## Easy Difficulty
**Protection:** None.
**Solution:** Use the `../` sequence to navigate up to the root or other sensitive directories.
**Payload:** `../../.env` or `../../../../etc/passwd`
**Explanation:** The `path.join` function resolver allows `..` to move out of the `files` directory.

---

## Medium Difficulty
**Protection:** Strips the `../` sequence once.
**Solution:** Use nested sequences that resolve to `../` after the replacement.
**Payload:** `....//....//.env`
**Explanation:** The filter replaces `../` with an empty string. If you provide `....//`, it becomes `../` after the replacement, effectively bypassing the single-pass filter.

---

## Hard / Nightmare Difficulty
**Protection:** Strict check for the presence of `..`.
**Solution:** This implementation is highly secure. If `..` is blocked, you cannot traverse out of the base directory. However, you can still read any file *within* the `files` directory or any of its subdirectories if you know the name.
**Note:** On Hard, look for other vulnerabilities to gain a pivot or credentials first.
