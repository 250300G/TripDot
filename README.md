# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


🌍 TripDot - Smart Travel Planner

TripDot is a **Mobile-First** web application designed to help travelers plan their itineraries, manage budgets in real-time, and organize daily activities with precision.

## 🚀 Key Features

- **Trip Management**: Create, edit, and delete travel projects with automatic date calculation.
- **Daily Timeline**: View your schedule day-by-day with a clean, chronological interface.
- **Budget Tracking**: Real-time calculation of activity costs vs. budget limits, featuring visual alerts for overspending.
- **Live Weather**: Integrated weather status for each destination to help you plan accordingly.
- **Sophisticated UI**: A modern, responsive design built with **Bootstrap 5** and **Material UI (MUI)** components.
- **Data Persistence**: Full CRUD operations powered by a REST API (JSON Server).

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), React Router 6.
- **UI/UX**: Bootstrap 5 (Layout), Material UI (Interactive components & Skeletons).
- **Backend**: JSON Server (Deployed on Render/Railway).
- **HTTP Client**: Axios.

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [https://github.com/250300G/TripDot.git](https://github.com/YOUR_USERNAME/TripDot.git)
   cd TripDot

    Install dependencies
    Bash

    npm install

    Environment Variables
    Create a .env file in the root directory and add your backend URL:
    Extrait de code

    VITE_SERVER_URL=[https://your-deployed-api.com](https://your-deployed-api.com)

    Run the application
    Bash

    npm run dev

📱 Mobile-First Approach

TripDot was designed with a mobile-first philosophy. Key UI elements like the Floating Action Button (FAB) for adding activities and Skeleton Loaders ensure a smooth, app-like experience on smartphones.
📂 Project Structure

    src/pages: Main views (Home, Trip Details, Timeline, Create/Edit forms).

    src/components: Reusable UI elements (Trip Cards, Navbar).

    db.json: Database structure for trips and activities.