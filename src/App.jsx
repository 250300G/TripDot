import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Routes, Route } from 'react-router-dom';
 
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import TripListPage from './pages/TripListPage';
import TripDetailsPage from './pages/TripDetailsPage';
import EditActivityPage from './pages/EditActivityPage';
import CreateTripPage from './pages/CreateTripPage';
import EditTripPage from './pages/EditTripPage';
import CreateActivityPage from './pages/CreateActivityPage';
import TripTimelinePage from './pages/TripTimelinePage';  

function App() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light text-dark">
      <Navbar />
      <main className="container mt-3 flex-grow-1">
        <div className="bg-white p-3 rounded shadow-sm">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/trips" element={<TripListPage />} />
            <Route path="/trips/create" element={<CreateTripPage />} />
            <Route path="/trips/:tripId" element={<TripDetailsPage />} />
            <Route path="/trips/edit/:tripId" element={<EditTripPage />} />
            <Route path="/trips/:id/timeline" element={<TripTimelinePage />} /> 

            {/* ROUTES ACTIVITÉS */}
            <Route path="/activities/create" element={<CreateActivityPage />} />
            <Route path="/activities/edit/:activityId" element={<EditActivityPage />} />
            
            <Route path="*" element={<div className="text-center mt-5"><h2>404</h2><p>Page not found</p></div>} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;