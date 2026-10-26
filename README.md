# 🔎 Searchify — Lost & Found Portal

**Find what's lost. Return what's found.**

Searchify is a campus-focused Lost & Found portal designed to help students and staff report, discover, and recover misplaced belongings. It provides a simple interface for reporting lost or found items, searching listings, and managing item status.

## ✨ Features

- 🔍 **Browse & Search:** Explore lost and found listings and search by keywords.
- 📝 **Report Items:** Submit details about lost or found belongings.
- 🗂️ **Category Filtering:** Organize items by category and type.
- 📍 **Location Details:** View where an item was lost or found.
- 📊 **Dashboard Statistics:** View portal statistics and item counts.
- ✅ **Claim & Resolve:** Update item status when an item is recovered.
- 🔐 **Mock Authentication:** Demonstration login and registration functionality.
- 📱 **Responsive Interface:** Designed for convenient use across screen sizes.
- 💾 **JSON-Based Storage:** Uses a JSON file for demonstration data.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling and responsive layout |
| JavaScript (ES6+) | Frontend functionality |
| Node.js | Backend runtime |
| Express.js | REST API and server |
| CORS | Cross-origin API access |
| JSON | Demo data storage |
| Git & GitHub | Version control and collaboration |
| Vercel | Frontend deployment |
| Render | Backend deployment |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- Git installed
- A web browser
- A code editor such as VS Code

### 1. Clone the repository

```bash
git clone https://github.com/geetamgoyal/lost-and-found.git
cd lost-and-found
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the backend server

```bash
npm start
```

The server runs at:

```text
http://localhost:3000
```

### 4. Open the application

If the frontend files are served by Express, open:

```text
http://localhost:3000
```

If the frontend has been moved into a separate `frontend/` directory for deployment, open `frontend/index.html` through a local development server and configure its API URL to point to the running backend.

## 🔌 API Endpoints

The backend provides REST API endpoints for the application's main features.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check backend health |
| GET | `/api/stats` | Retrieve portal statistics |
| GET | `/api/items` | Retrieve and filter items |
| GET | `/api/items/:id` | Retrieve one item |
| POST | `/api/items` | Report a lost or found item |
| PATCH | `/api/items/:id/claim` | Mark an item as claimed |
| DELETE | `/api/items/:id` | Delete an item |
| POST | `/api/auth/login` | Demonstration login |
| POST | `/api/auth/register` | Demonstration registration |
| POST | `/api/reset` | Reset demo data |

### Health Check

Open `http://localhost:3000/api/health` to verify that the backend is running.

## 📁 Project Structure

```text
lost-and-found/
├── frontend/             # Frontend files (if separated)
│   ├── index.html
│   ├── app.js
│   ├── lost&found.css
│   └── assets/
├── data/
│   └── items.json        # Demo item data
├── server.js             # Express backend
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

*The `frontend/` directory is used if you separate the static frontend for Vercel deployment. Otherwise, your frontend files may remain at the repository root.*

## 🌐 Deployment

Searchify can be deployed using separate frontend and backend services.

- **Frontend:** [Vercel](https://vercel.com/)
- **Backend:** [Render](https://render.com/)

Configure the frontend API base URL to point to the deployed backend, and configure the backend's `FRONTEND_URL` environment variable with the deployed frontend origin for CORS.

> **Note:** The project currently uses JSON-file demo storage and mock authentication. A temporary hosting filesystem may not preserve data across restarts or redeployments. Persistent storage or a database is recommended for production use.

## 👥 Team Members

| Team Member | Role |
|---|---|
| [Ayush Kumar](https://github.com/REPLACE_WITH_AYUSH_USERNAME) | Frontend Developer |
| [Geetam Goyal](https://github.com/geetamgoyal) | Backend Developer |
| [Gaurang Gupta](https://github.com/REPLACE_WITH_GAURANG_USERNAME) | Integration Developer & Researcher |

**Note:** Replace the placeholder usernames in the Ayush Kumar and Gaurang Gupta links with their actual GitHub usernames.

## 🎯 Project Objective

The objective of Searchify is to make campus lost-and-found management easier by providing a centralized platform for reporting, searching, and recovering belongings.

## 🔮 Future Enhancements

- Database integration for persistent storage
- Secure authentication and authorization
- Image uploads for item listings
- Email or in-app notifications
- Advanced search and filtering
- Administrative dashboard

## 📄 License

This project is developed as a college mini-project for educational and demonstration purposes.
