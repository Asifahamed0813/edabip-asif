# EDABIP Settings Dashboard

A responsive workspace settings dashboard built with semantic HTML, CSS, and vanilla JavaScript. It uses no framework or UI library.

## Run locally

1. Download or clone the repository.
2. Open `index.html` in your browser.

For local development, open the project folder in VS Code and use Live Server if you have that extension installed.

## Project files

- `index.html` — dashboard structure, forms, navigation, and accessible controls.
- `style.css` — theme variables, layout, component styles, and responsive breakpoints.
- `script.js` — integration and role demo data, event handlers, search, form feedback, and theme behavior.
- `Setting.jpg` — reference image used while building the interface.

## Features

- Responsive settings dashboard with mobile navigation and a collapsible sidebar.
- Light and dark themes; the selected theme is remembered in browser storage when available.
- Search that filters relevant settings sections.
- Profile and notification form validation with demo feedback.
- Email, SMS, and two-factor authentication switches.
- Demo connect/disconnect controls for integrations and a live connected-services count.
- Password visibility control and basic new-password length validation.
- Roles overview and permission matrix views.
- Toast feedback for demo actions and section navigation.

## Scope and data behavior

This is a front-end prototype. Profile and notification submissions display confirmation messages but are not sent to a server. Integration changes and toggle selections exist in the current page session; they are not persisted. The theme preference is stored locally in the browser when local storage is available. Password input is not stored.

## Development notes

The JavaScript is organized into small functions for initialization, rendering, event handling, form feedback, and theme management. UI actions that are prototypes are labelled as demo behavior rather than represented as real backend operations.

## Suggested commit messages

- `Refactor dashboard interactions for maintainability`
- `Improve accessibility and security form behavior`
- `Update project documentation`
