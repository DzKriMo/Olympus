# Writeup: Echoes of the Styx (Stored XSS)

## Objective
Inject and execute arbitrary JavaScript in the context of other users viewing the communal board.

## Vulnerability Detail
The comment body is rendered directly in the HTML without sufficient sanitization or escaping in certain modes.

```javascript
<div>${comment.body}</div>
```

---

## Easy Difficulty
**Protection:** None.
**Solution:** Use a basic `<script>` tag.
**Payload:** `<script>alert('XSS')</script>`
**Explanation:** The script is stored in the database and executed whenever a user views the post.

---

## Medium Difficulty
**Protection:** Regular expression that strips `<script>` tags.
**Solution:** Use an alternative HTML element with an event handler.
**Payload:** `<img src=x onerror=alert('XSS')>`
**Explanation:** The filter only looks for `<script>` tags. Event handlers like `onerror` on an `img` tag with a broken `src` will execute the script.

---

## Hard / Nightmare Difficulty
**Protection:** Regular expression that strips `<script>` tags AND `on*=` event handlers.
**Solution:** Use an SVG element to embed a script.
**Payload:** `<svg><script>alert('XSS')</script></svg>`
**Explanation:** The filter for `<script>` might not be recursive or might be bypassed by nested elements. Alternatively, use a protocol-based injection like `<a href="javascript:alert('XSS')">Click me</a>`.
