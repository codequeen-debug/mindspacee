# MindSpace 🌿

A mindfulness app built with Vite + React, based on a Figma prototype.

## Live Link
https://mindspaceee.netlify.app/


## Features

- **Planner** — Calendar (navigable month view) + task checklist with add/delete/sort
- **Focus** — S.A.V.E.R.S morning routine checklist with completion celebration
- **Journal** — Reflection journal with save/delete/lock/sort entries
- Context menus matching the prototype's dark modal pattern
- Global state via React `useReducer` + Context API

## How Mindspace Features further Fulfill Assignment Requirements

### 1. Core Theme & Real-World Problem
- **Domain:** Productivity tools / Mental health.
- **User Need:** Students and professionals need a unified platform to manage stress, focus, and emotional well-being.
- **Justification:** Mindspace combines journaling, mood tracking, chat support, and planning to address mental health and productivity in one app.

### 2. Beyond CRUD: Advanced Features
- **Real-time Features:**  
  - **Live Chat:** The ChatScreen enables users to send and receive messages instantly, supporting real-time peer or mentor support.
  - **Status Bar:** The StatusBar component updates in real time to reflect user mood and activity.
  - **Live Journal/Planner Updates:** Journal and planner entries update instantly for the user, leveraging Firestore’s real-time listeners.
- **Role-Based Access:**  
  - **Protected Routes:** Only authenticated users can access core features (see ProtectedRoute.jsx and AuthContext.jsx).
  - **User Roles:** The app can be extended for admin/moderator roles if needed.
- **External API Integration:**  
  - **Firebase Authentication:** Handles secure login/signup.
  - **Firestore Database:** Stores and syncs user data (journals, chats, planner).
- **Async/Background Processing:**  
  - **Firestore Listeners:** All data changes (journal, chat, planner) are synced in real time without manual refresh.
  - **Async Data Fetching:** All user data is loaded asynchronously for performance and responsiveness.

### 3. System Design Component
- **Architecture:**  
  - **Frontend:** React (Vite) with modular components for each feature (ChatScreen, JournalScreen, PlannerScreen, etc.).
  - **Backend:** Firebase (Authentication, Firestore, Hosting).
  - **Data Flow:** User actions in the UI trigger updates to Firestore, which pushes real-time updates back to the UI.
- **Database Schema:**  
  - **Users:** Authenticated via Firebase Auth.
  - **Journal Entries:** Stored per user in Firestore (see data/journalEntries).
  - **Chat Messages:** Stored in Firestore, supporting real-time chat.
  - **Planner Tasks:** Stored per user for daily/weekly planning.
- **Trade-offs:**  
  - **Firebase BaaS:** Chosen for rapid development, real-time sync, and managed security, trading off some backend customization.

### 4. Backend Strategy
- **Firebase BaaS:**  
  - **Why:** Provides real-time updates, secure authentication, and scalable hosting without server management.
  - **How it fits:** All Mindspace features (auth, data storage, real-time sync) are built on Firebase services.

### 5. Non-functional Requirements
- **Security:**  
  - **Authentication:** Only logged-in users can access personal data.
  - **Protected Routes:** Prevents unauthorized access to sensitive pages.
  - **Validation:** Input validation on forms (login, signup, journal, chat).
- **Performance:**  
  - **Real-time Sync:** Firestore listeners ensure instant updates.
  - **Optimized Rendering:** React components update only when needed.
- **Usability:**  
  - **Modern UI:** Clean, intuitive design (see index.css, App.jsx).
  - **Mobile-Friendly:** Responsive layout for all devices.
  - **Simple Navigation:** BottomNav and clear page structure.
- **Reliability:**  
  - **Managed by Firebase:** High uptime, automatic scaling, and data consistency.

### 6. Team Collaboration
Here’s the sample task breakdown as bullet points:

- Rich
  - Project setup & Firebase integration (auth, Firestore, hosting)
  - Authentication (login, signup, protected routes)
  - State management (contexts, store.jsx)
  - Utility functions (firestoreHelpers.js)
  - Deployment

- Sara
  - Journal feature (UI, CRUD, real-time updates)
  - Planner feature (UI, CRUD, real-time updates)
  - Bottom navigation & overall UI/UX polish

- MK
  - Chat feature (UI, real-time messaging, Firestore listeners)
  - Status bar & mood tracking
  - Unit testing (StatusBar.test.jsx, others)

- All
  - Documentation (README, UI, user stories)
    

## System Architecture

### Structural Diagram
<img width="565" height="550" alt="mindspace_system_architecture_overview" src="https://github.com/user-attachments/assets/18d2a061-d481-4880-879f-4b9ea71cfb38" />

### Data flow diagram
<img width="540" height="520" alt="image" src="https://github.com/user-attachments/assets/5eb8f08a-bf83-4502-b38f-0be450a03364" />



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

# Demo
https://github.com/user-attachments/assets/287586b6-f414-4bf3-ad3f-c3d7835e8e28
