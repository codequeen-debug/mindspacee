# MindSpace 🌿

A mindfulness app built with Vite + React, based on the FHCC Figma prototype.

## Features

- **Planner** — Calendar (navigable month view) + task checklist with add/delete/sort
- **Focus** — S.A.V.E.R.S morning routine checklist with completion celebration
- **Journal** — Reflection journal with save/delete/lock/sort entries
- Context menus matching the prototype's dark modal pattern
- Global state via React `useReducer` + Context API

## Setup

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── main.jsx              # Entry point
├── App.jsx               # Shell + routing
├── index.css             # Design tokens + global styles
├── store/
│   └── store.jsx         # useReducer state + StoreContext
├── components/
│   ├── StatusBar.jsx
│   └── BottomNav.jsx
└── pages/
    ├── HomeScreen.jsx
    ├── PlannerScreen.jsx
    ├── FocusScreen.jsx
    └── JournalScreen.jsx
```

## Design System

Colors, spacing, and typography are all defined as CSS custom properties in `index.css`.
The palette matches the prototype: light steel blue (`#7fafc4`) primary, muted teal navbar,
lavender calendar accent (`#9b8ec4`), and dark modals (`#2e2e3e`).

Fonts: **Sora** (display/headings) + **DM Sans** (body text) via Google Fonts.
