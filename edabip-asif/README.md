# EDABIP Settings Dashboard

A responsive settings dashboard recreation built with **HTML, CSS, and vanilla JavaScript**. No frameworks or UI libraries are used.

## Run locally

1. Download or clone this repository.
2. Open the `index.html` file in your browser.

Optional: In VS Code, install the **Live Server** extension, right-click `index.html`, and select **Open with Live Server**.

## Files

- `index.html` — semantic page structure and accessible form labels.
- `style.css` — CSS variables, layout, responsive styles, and component states.
- `script.js` — sample integration/role data and working demo interactions.
- `Setting.jpg` — original reference screenshot (if included in the project).

## Interactions included

- Search/filter settings sections.
- Expand/collapse sections.
- Responsive mobile navigation and collapsible desktop sidebar.
- Form validation and demo save messages.
- Email/SMS/2FA toggle switches.
- Connect/disconnect integration buttons.
- Show/hide password.
- Roles Overview / Permission Matrix tabs and pagination.
- Toast feedback for sample actions.

## Important note

This is a front-end-only demo. Save buttons and integration actions do not connect to a backend or persist data after the page is refreshed.

## Screenshot

After opening the page, take a screenshot and save it as `screenshot.png` in the project root. Add it to this README with:

```md
![EDABIP Settings Dashboard](screenshot.png)
```

## What was difficult

Matching the reference screenshot required balancing several form columns, card spacing, table sizes, and responsive behaviour. The layout uses CSS Grid for forms and cards, then media queries to stack content on smaller screens.

## Suggested Git commit messages

```text
Initial project structure
Build dashboard layout and navigation
Style settings forms and cards
Add JavaScript interactions
Improve responsive layout and accessibility
Add README and screenshot
```
