import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function HomePage() {
  const [recentTrips, setRecentTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/trips`);
        const data = Array.isArray(response.data) ? response.data : [];
        setRecentTrips(response.data.slice(0, 3));
      } catch (error) {
        console.log(error);
      }
    };
    fetchTrips();
  }, []);

  return (
    <div className="HomePage py-4">
      {/* HERO */}
      <div className="text-center py-5 mb-4 rounded-3 bg-dark text-white">
        <h1 className="display-5 fw-bold">
          Trip<span className="text-primary">Dot</span>
        </h1>
        <p className="lead text-secondary">Plan your next trip with precision.</p>
        <Link to="/trips" className="btn btn-primary btn-lg mt-2 me-2">
         My trips
        </Link>
        <Link to="/trips/create" className="btn btn-outline-light btn-lg mt-2">
          + New trip
        </Link>
      </div>

      {/* VOYAGES RÉCENTS */}
      {recentTrips.length > 0 && (
        <>
          <h4 className="fw-bold mb-3">Last Trip</h4>
          <div className="list-group mb-4">
            {recentTrips.map((trip) => (
              <Link
                key={trip.id}
                to={`/trips/${trip.id}`}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{trip.destination}</strong>
                  <span className="text-muted ms-2 small">
                    {trip.startDate} — {trip.endDate}
                  </span>
                </div>
                <span className={`badge ${
                  trip.status === "done" ? "bg-success" :
                  trip.status === "ongoing" ? "bg-warning text-dark" : "bg-primary"
                }`}>
                  {trip.status === "done" ? "Passé" : trip.status === "ongoing" ? "En cours" : "À venir"}
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link to="/trips" className="btn btn-outline-dark btn-sm">
            All trips →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default HomePage;
