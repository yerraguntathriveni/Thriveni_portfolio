# Yerragunta Thriveni – Portfolio (frontend only)
HTML5 · CSS3 · vanilla JavaScript. No backend, no build step, no dependencies.

## Run
Open the folder with any static server (needed for the admin password hashing, which requires `localhost` or `https`):
```bash
python -m http.server 8000     # then open http://localhost:8000
```
or use VS Code "Live Server". Deploy by uploading the folder to Netlify / GitHub Pages / Vercel.

- Public site: `index.html`  ·  Admin: `admin.html` (type the URL; it is not linked from the site)
- Default login: username `admin`, password `Thriveni@Admin2026` (change it in Admin > Profile right away). Only a salted SHA-256 hash is in the code.
- Admin > Theme changes palette, default mode and heading font. The resume PDF is in `resume/` and can be replaced in Admin > Profile.

## Files
```
index.html  admin.html
css/style.css
js/data.js   default content + localStorage store
js/main.js   public site rendering, theme, tracking, contact form
js/admin.js  admin login, dashboard, CRUD, uploads, enquiries, export/import
```

## Important limits of a frontend-only site
Everything is saved in the browser's localStorage, so:
- Admin edits show on the public site **only in the same browser**. Other visitors see the default content in `js/data.js`. To publish edits for everyone, update the defaults in `js/data.js` (or use Admin > Profile > Export, then copy the values) and redeploy.
- Visitor counts, enquiries and uploaded photo/resume are stored per browser, not across devices. Contact messages sent by other people do not reach the admin; the public contact info (email/phone) is shown for that.
- The admin login is a convenience lock, not real security: someone with access to the browser can bypass it. For real login, cross-device analytics and shared storage, a backend is required.
- Photo/project images are resized and stored as data URLs; resume PDF max 1.5MB (browser storage is ~5MB).
