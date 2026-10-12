# Searchify - Campus Lost & Found Portal

A full-stack web application designed to help students and staff quickly report, search, and reconnect with lost and found belongings across the university campus.

## 🚀 Features

- **Node.js Express Backend REST API**:
  - `GET /api/stats`: Dynamic statistics with live session counts.
  - `GET /api/items`: Filter items by type (Lost/Found/Claimed), category, and live search keyword.
  - `GET /api/items/:id`: Item details lookup.
  - `POST /api/items`: Report new lost or found items with immediate persistence in `data/items.json`.
  - `PATCH /api/items/:id/claim`: Mark item as claimed/recovered.
  - `POST /api/auth/login`: Campus student authentication with quick demo credentials.
  - `POST /api/reset`: Reset mock data to original defaults.
- **Rich Campus Mock Data**: Pre-loaded with realistic campus items (AirPods, Student IDs, Hydro Flask, Graphing Calculator, Keys, Notes, Headphones).
- **Interactive UI & Real-Time Filtering**:
  - **Live Search**: Instant filtering as you type item name, location, or keywords.
  - **Filter Tabs**: Filter by *All Items*, *Lost Items*, *Found Items*, and *Resolved / Claimed* with dynamic counts.
  - **Category Filter**: Electronics, ID & Cards, Wallets & Keys, Books & Notes, Clothing & Personal, and Other.
  - **Animated Stats**: Counter animations for lost items, found items, success rates, and active users.
- **Glassmorphic Modern Design**: Built with Google Font Plus Jakarta Sans, backdrop blur effects, responsive cards grid, status badges, and smooth micro-animations.
- **Modals & Toast Notifications**:
  - Report Lost/Found modal with form validation.
  - Item Details & Claim modal with instant recovery resolution.
  - Campus Sign In modal with quick 1-click demo login.
  - Floating toast notifications for real-time user feedback.
- **Offline / Standalone Fallback**: Includes a fallback client store using `localStorage` so the frontend also works if opened standalone.

## 📦 Tech Stack
- **Backend**: Node.js, Express, CORS
- **Frontend**: HTML5, Vanilla CSS3 (Custom Glassmorphism Design System), JavaScript (ES6+)
- **Data Storage**: JSON-based mock database (`data/items.json`)

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Backend Server
```bash
npm start
```
Or with auto-reload in development:
```bash
npm run dev
```

### 3. Open in Browser
Visit **[http://localhost:3000](http://localhost:3000)** in your browser.
