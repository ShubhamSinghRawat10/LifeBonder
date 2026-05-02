# Blood Donation Website

A full-stack blood donation platform built with React, Vite, Express, and MongoDB. The project helps donors register, allows users to search for matching blood donors by location and blood group, and supports map-based discovery for faster local outreach during urgent situations.

## Overview

This project combines:

- A modern React frontend for donor registration, donor search, sign-in, and informational pages
- An Express + MongoDB backend for authentication and donor data management
- Geolocation-aware donor search with optional Google Maps integration
- A preserved `legacy/` frontend folder containing earlier static HTML/CSS/JS pages

The current experience is especially focused on Indian states and cities, with a searchable donor flow and map-based visibility for nearby matches.

## Features

- Responsive landing page with project mission, coverage view, and quick donor search
- Donor registration form with validation for age, phone number, and blood group details
- Search donors by state, city, blood group, and distance
- Use browser geolocation to find and highlight the nearest donor
- Google Maps donor view when a valid API key is configured
- OpenStreetMap/Leaflet-powered coverage map on the homepage
- Sign-in flow connected to JWT-based backend endpoints
- MongoDB geospatial search using a `2dsphere` index
- Mock donor fallback on the search page if the backend is unavailable during frontend development

## Tech Stack

### Frontend

- React 18
- React Router
- Vite
- Google Maps JavaScript API
- Leaflet with OpenStreetMap tiles

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT (`jsonwebtoken`)
- `bcryptjs`
- `cors`
- `dotenv`

### Tooling

- `concurrently`
- `nodemon`

## Project Structure

```text
blood donation/
|-- backend/
|   |-- .env.example
|   `-- server/
|       |-- config/
|       |-- controllers/
|       |-- middleware/
|       |-- models/
|       |-- routes/
|       `-- utils/
|-- frontend/
|   |-- .env.example
|   |-- img/
|   |-- legacy/
|   |-- src/
|   |   |-- components/
|   |   |-- lib/
|   |   `-- pages/
|   `-- vite.config.js
|-- package.json
`-- README.md
```

## Pages

- `/` - home page with mission, quick search, and coverage map
- `/donate` - donor registration form
- `/search` - donor search with optional geolocation and Google Maps results
- `/about` - project information
- `/signin` - sign-in form for returning users

## API Endpoints

### Health

- `GET /api/health` - returns API status

### Auth

- `POST /api/auth/register` - create a user account
- `POST /api/auth/login` - authenticate a user and return a JWT

### Donors

- `POST /api/donors` - register a donor
- `GET /api/donors/search` - search donors using query parameters:
  - `state`
  - `city`
  - `blood_group`
  - `distance`
  - `latitude`
  - `longitude`

## Environment Variables

Create your local environment files from the provided examples.

### Backend: `backend/.env`

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/blood-donation-app
JWT_SECRET=replace_with_a_strong_secret
CLIENT_ORIGIN=http://127.0.0.1:5173
```

### Frontend: `frontend/.env`

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_API_BASE_URL=http://localhost:3000/api
```

### Notes

- `VITE_GOOGLE_MAPS_API_KEY` is optional. Without it, the donor search page still works, but the live Google Map is replaced with a helpful placeholder.
- If your frontend runs on a different port, update `CLIENT_ORIGIN` to match it.
- Make sure `VITE_API_BASE_URL` points to the running backend API.

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- MongoDB running locally or a reachable MongoDB connection string

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment files

Create:

- `backend/.env` from `backend/.env.example`
- `frontend/.env` from `frontend/.env.example`

### 3. Start the development servers

```bash
npm run dev
```

This starts:

- the Express API at `http://localhost:3000`
- the Vite frontend at `http://127.0.0.1:5173` in a typical local setup

### 4. Open the app

Visit the frontend URL shown by Vite in your terminal, usually:

```text
http://127.0.0.1:5173
```

## Available Scripts

From the project root:

- `npm run dev` - run frontend and backend together in development mode
- `npm run client:dev` - run only the Vite frontend
- `npm run server:dev` - run only the backend with nodemon
- `npm run server` - run the backend with Node.js
- `npm run build` - build the frontend into `frontend/dist`
- `npm run preview` - preview the built frontend

## Sample Request Flow

### Register a donor

1. Open `/donate`
2. Fill in donor information
3. Optionally capture current location
4. Submit the form
5. Backend stores donor data, including map coordinates when available

### Search for donors

1. Open `/search`
2. Choose a state, city, blood group, and distance
3. Optionally use your current location
4. View matching donors
5. If coordinates are available, the closest donor can be highlighted on the map

## Development Notes

- The homepage coverage section uses local mock donor data to provide an interactive experience out of the box.
- The search page falls back to mock donor filtering if the backend request fails, which is useful during UI development.
- The sign-in and donor registration pages are wired to backend endpoints, but the UI also shows friendly fallback messages if the backend is not reachable.
- `frontend/legacy/` contains older static pages kept alongside the current React implementation.

## Deployment Notes

- Build the frontend with `npm run build`
- Serve `frontend/dist` using your preferred static hosting setup
- Run the Express backend separately with environment variables configured
- Use a production-grade MongoDB instance and a strong `JWT_SECRET`
- Restrict Google Maps API referrers and enable billing if you use the Maps integration in production

## Future Improvements

- Add automated tests for frontend and backend flows
- Add donor profile management and availability updates
- Protect authenticated routes on the frontend
- Add pagination, filtering improvements, and admin tools
- Add Docker support and deployment configuration

## License

This project currently does not define a license. Add one if you plan to publish or distribute it.
