# EDABIP Settings Dashboard

A responsive settings dashboard prototype built with semantic HTML, CSS, and vanilla JavaScript modules.

## Run locally

ES modules and `fetch()` need a local web server. Do **not** open `index.html` directly by double-clicking it.

1. Clone or download this repository.
2. Open the project folder in VS Code.
3. Start **Live Server** from `index.html`, or run `python -m http.server 8000` in the project folder.
4. Open the local URL shown by Live Server, or visit `http://localhost:8000`.

The dashboard uses dummy data only. Never enter real passwords or payment-card details.

## Project structure

```text
edabip-asif/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── data.js
│   ├── render.js
│   ├── events.js
│   ├── storage.js
│   ├── roles.js
│   └── validators.js
├── data/
│   ├── integrations.json
│   └── roles.json
├── assets/
│   └── README.md
├── Setting.jpg
└── README.md
```

## What each module does

- `index.html` — page structure, forms, navigation, and accessible controls.
- `css/style.css` — layout, component styling, theme styles, and responsive breakpoints.
- `js/main.js` — app startup, asynchronous data loading, and theme toggle.
- `js/data.js` — fetches the JSON files with `async/await`.
- `js/render.js` — displays loading status and renders integration cards and counts.
- `js/events.js` — handles Connect/Disconnect actions.
- `js/storage.js` — saves and restores integration states using `localStorage` with `try/catch`.
- `js/roles.js` — renders the roles overview and permission matrix, pagination, and saved permission changes.
- `js/validators.js` — reusable validation helpers for required fields, email, Indian mobile number, and password checks.
- `data/*.json` — sample integration and role data, kept outside the JavaScript modules.
- `assets/` — place project screenshots and other UI assets here.

## Current implementation

- Responsive settings dashboard layout.
- JSON data loaded with `fetch()` and `async/await`.
- Loading, error, and empty-data feedback for the data-driven sections.
- Integration Connect/Disconnect controls update their status and connected count; the selected state is remembered after refresh.
- Roles overview with pagination.
- Permission matrix with an unsaved-changes message and a Save action that stores permissions locally.
- Light/dark theme toggle.

This is a front-end practice project, not a production system. Local storage is only for demo persistence; authentication, password handling, and authorization would require a secure backend in a real application.

## Testing checklist

- Run through Live Server or `python -m http.server`.
- Confirm the page reports that settings data loaded.
- Connect or disconnect an integration, refresh, and confirm its state remains.
- Switch between Roles Overview and Permission Matrix.
- Change a permission, confirm the unsaved-changes message appears, save, and refresh to verify persistence.
- Check the layout at desktop and mobile widths.
- Check the browser console for errors.

## What I found difficult

Keeping the page working while splitting the original JavaScript into separate modules was the main challenge. The modules need to load in the right order, and JSON files must be served over a local web server for `fetch()` to work.

## Next step

Finish wiring the reusable validators to the General Settings, Notifications, and Change Password forms, and persist those form settings. Add a fresh screenshot of the completed interface to `assets/` before final submission.
