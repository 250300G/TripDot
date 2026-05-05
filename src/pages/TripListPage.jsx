import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TripCard from "../components/TripCard"; 

function TripListPage() {
  const [allTrips, setAllTrips] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/trips`); // 
      setAllTrips(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // 🔍 Filtrage par destination
  const filteredTrips = allTrips
    ? allTrips.filter((trip) =>
        trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  if (!allTrips) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-dark" role="status" />
        <p className="mt-3 text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="TripListPage py-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">My trips</h2>
        <Link to="/trips/create" className="btn btn-dark btn-sm px-3">
          + New Trip
        </Link>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Rechercher une destination..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* EMPTY STATE */}
      {filteredTrips.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted fs-5">No trip found.</p>
          <Link to="/trips/create" className="btn btn-outline-dark mt-2">
           Create my first Trip
          </Link>
        </div>
      ) : (
        <div className="row">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} /> // ✅ prop "trip" cohérente avec TripCard.jsx
          ))}
        </div>
      )}
    </div>
  );
}

export default TripListPage; // ✅ nom cohérent avec App.jsx
