# Writeup: The Labyrinthine Query (SQL Injection)

## Objective
Exploit the search functionality in the Divine Records to extract sensitive user information or bypass authentication.

## Vulnerability Detail
The search query is built using string interpolation, making it vulnerable to SQL injection.

```javascript
let sql = `SELECT id, username, role, bio FROM users WHERE username LIKE '%${queryText}%' OR bio LIKE '%${queryText}%'`;
```

---

## Easy Difficulty
**Protection:** None.
**Solution:** A simple tautology can be used to return all users.
**Payload:** `' OR 1=1 --`
**Explanation:** This makes the `WHERE` clause always true, bypasses the `LIKE` filters, and comments out the rest of the query.

---

## Medium Difficulty
**Protection:** Case-insensitive blacklist for `UNION`, `SELECT`, and `OR 1=1`.
**Solution:** Use alternative tautologies or bypass the regex. Since the regex specifically looks for `OR\s+\d+=\d+`, you can use string comparison or other logic.
**Payload:** `' OR 'a'='a' --`
**Explanation:** The regex `or\s+\d+=\d+` only matches numeric equality. String equality like `'a'='a'` bypasses it.

---

## Hard / Nightmare Difficulty
**Protection:** Strict blacklist for `'`, `--`, `UNION`, `SELECT`, and `OR`.
**Solution:** If single quotes are blocked, you can try using backticks (if SQLite/MySQL allows) or hex encoding if the input is processed, but here it's raw. However, notice the `LIKE` clause uses `%`. You can use the `%` wildcard itself to enumerate characters without injection if the goal is just discovery. To achieve *injection* without `'`, you might need to find another entry point or use a different technique.
**Bypass Technique:** In this specific implementation, if `'` is blocked, you are restricted. However, you can still use `%` and `_` wildcards in the search to leak information character by character via the `LIKE` clause itself (Blind-style reconnaissance within the intended feature).
