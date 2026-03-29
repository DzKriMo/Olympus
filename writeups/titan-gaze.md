# Writeup: The Titan Gaze (IDOR)

## Objective
Access or modify other users' records by manipulating object identifiers in requests.

## Vulnerability Detail
The `/account` endpoint uses an `id` parameter from the query string to fetch user details without verifying if the current user has permission to see that record.

```javascript
const id = req.query.id || (req.session.user && req.session.user.id) || 1;
const user = db.prepare("SELECT id, username, role, bio FROM users WHERE id = ?").get(id);
```

---

## Easy / Medium Difficulty
**Protection:** None.
**Solution:** Change the `id` parameter in the URL.
**Payload:** `/account?id=2` or `/account?id=1` (to see the admin's secret).
**Explanation:** The server fetches any user ID requested without checking ownership or roles.

---

## Hard / Nightmare Difficulty
**Protection:** Ownership check that ensures the requested ID matches the session user, unless the user is an admin.
**Solution:** To exploit this on Hard, you must first escalate your privileges to `admin` (e.g., via the Golden Fleece/JWT exploit) or find a guest account (like `id=3`) that might be exempted from the check.
**Explanation:** The code specifically checks `String(id) !== String(req.session.user?.id || "") && req.session.user?.role !== "admin"`. Escalating to admin allows the Titan's Gaze to see all.
