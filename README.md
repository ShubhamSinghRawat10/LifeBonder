<div align="center">
  <img src="https://img.icons8.com/color/96/000000/drop-of-blood.png" alt="LifeBonder Logo" width="80" />
  
  # LifeBonder - Blood Donation Platform 🩸
  
  *Empowering communities by connecting blood donors with those in need.*

  <p align="center">
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" /></a>
    <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" /></a>
    <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" /></a>
  </p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
</div>

<br />

## 📖 Overview

**LifeBonder** is a modern, responsive full-stack web application designed to bridge the gap between blood donors and recipients. During urgent medical situations, time is of the essence. LifeBonder simplifies the process of finding local donors by integrating a powerful geospatial search engine and an intuitive user interface. 

With built-in geolocation and mapping capabilities, users can quickly locate the nearest matching blood donor, fostering a faster and more efficient community outreach.

---

## ✨ Key Features

- 🔍 **Advanced Donor Search:** Filter by blood group, state, city, and proximity (distance).
- 🗺️ **Geospatial & Map Integration:** View donors on an interactive Google Map or OpenStreetMap coverage view.
- 📱 **Modern & Responsive UI:** A beautifully designed frontend with a sleek, glassmorphic navigation bar and dynamic transitions.
- 🔐 **Secure Authentication:** JWT-based secure sign-in and registration flows.
- 📍 **Location-Aware:** Uses browser geolocation to seamlessly detect and plot nearby matching donors.
- 🚀 **Fallback Mechanisms:** Built-in mock donor generation when the backend is unreachable—ideal for isolated frontend development.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18
- **Routing:** React Router v6
- **Build Tool:** Vite
- **Maps:** Google Maps API & Leaflet (OpenStreetMap)
- **Styling:** Custom Vanilla CSS with modern aesthetics (Flexbox, Grid, Glassmorphism)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose)
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs
- **Geospatial:** MongoDB `2dsphere` indexes for radius search

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance or Atlas URI)

### 1. Clone the repository

```bash
git clone https://github.com/ShubhamSinghRawat10/LifeBonder.git
cd LifeBonder/"blood donation"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

You need to create two `.env` files based on the provided examples.

**Backend (`backend/.env`):**
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/blood-donation-app
JWT_SECRET=your_super_secret_jwt_key
CLIENT_ORIGIN=http://127.0.0.1:5173
```

**Frontend (`frontend/.env`):**
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_API_BASE_URL=http://localhost:3000/api
```
*(Note: Google Maps API key is optional. Without it, the application elegantly falls back to a placeholder map.)*

### 4. Run the Application

The project uses `concurrently` to run both the frontend and backend servers seamlessly.

```bash
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000

---

## 📂 Project Structure

```text
LifeBonder/
├── backend/                  # Express server & MongoDB configurations
│   ├── config/               # Database connection strings
│   ├── controllers/          # Route logic and handlers
│   ├── models/               # Mongoose schemas (Donor, User, etc.)
│   ├── routes/               # API endpoints
│   └── server.js             # Entry point for the backend
├── frontend/                 # Vite + React application
│   ├── src/                  # React components, pages, and context
│   │   ├── components/       # Reusable UI components (Navbar, Footer, etc.)
│   │   ├── pages/            # View components (Home, Search, Donate, etc.)
│   │   └── styles.css        # Global CSS styling
│   └── index.html            # Main HTML template
└── package.json              # Project dependencies and workspace scripts
```

---

## 📡 API Reference

### Authentication
- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Authenticate and return JWT

### Donors
- `POST /api/donors` - Register a new donor
- `GET /api/donors/search` - Search for donors (Supports query params: `state`, `city`, `blood_group`, `distance`, `lat`, `lng`)

---

## 🤝 Contributing

Contributions make the open source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <b>Built with ❤️ for a better tomorrow.</b><br>
  If you find this project helpful, please consider giving it a ⭐️!
</div>
