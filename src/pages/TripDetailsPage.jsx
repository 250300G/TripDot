import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function TripDetailsPage() {
 
  const { tripId } = useParams();

  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
 
  const API_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
   
        const [tripRes, activitiesRes] = await Promise.all([
          axios.get(`${API_URL}/trips/${tripId}`),
          axios.get(`${API_URL}/activities?tripId=${tripId}`)
        ]);

        setTrip(tripRes.data);
        setActivities(activitiesRes.data);
        setError(false);
      } catch (err) {
        console.error("Erreur TripDot lors du chargement:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      fetchData();
    }
  }, [tripId, API_URL]);

  if (loading) return <p className="text-center mt-5">Loading TripDot...</p>;

  if (error || !trip) {
    return (
      <div className="text-center mt-5">
        <h3 className="text-danger">Oups ! no Trip found.</h3>
        <Link to="/trips" className="btn btn-dark mt-3">comeback to the list</Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* SECTION HEADER : Image & Infos principales */}
      <div className="row mb-4">
        <div className="col-md-6">
          <img
            src={trip.imageUrl}
            alt={trip.destination}
            className="img-fluid rounded shadow-sm mb-3"
            style={{ width: "100%", height: "300px", objectFit: "cover" }}
          />
        </div>
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h1 className="fw-bold m-0">{trip.destination}</h1>
            <span className={`badge ${
              trip.status === "done" ? "bg-success" : 
              trip.status === "planned" ? "bg-primary" : "bg-warning text-dark"
            }`}>
              {trip.status.toUpperCase()}
            </span>
          </div>
          <p className="text-muted fs-5 mb-3">
            {trip.startDate} — {trip.endDate}
          </p>
          <div className="p-3 bg-white border rounded">
            <p className="mb-0 text-secondary">Budget Limite</p>
            <h4 className="fw-bold">{trip.budgetLimit} {trip.userCurrency}</h4>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      {/* SECTION ACTIVITÉS */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Activities</h3>
        <button className="btn btn-outline-dark btn-sm">+ Add</button>
      </div>

      {activities.length === 0 ? (
        <div className="alert alert-light border text-center py-4">
          Aucune activité enregistrée pour ce voyage.
        </div>
      ) : (
        <div className="row g-3">
          {activities.map((activity) => (
            <div key={activity.id} className="col-12">
              <div className="card shadow-sm border-0 bg-white">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title fw-bold mb-1">{activity.title}</h5>
                    <p className="card-text text-muted mb-0 small">
                      {activity.time} • {activity.category.toUpperCase()}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="fw-bold mb-1">
                      {activity.priceLocal} {trip.localCurrency}
                    </p>
                    <Link
                      to={`/activities/edit/${activity.id}`}
                      className="btn btn-sm btn-light border"
                    >
                      Modify
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER ACTIONS */}
      <div className="mt-5 pt-3 border-top d-flex gap-3">
        <Link to="/trips" className="btn btn-link text-dark p-0 text-decoration-none">
          ← Retour
        </Link>
        <Link to={`/trips/edit/${trip.id}`} className="btn btn-outline-secondary ms-auto">
         Trip Parameters
        </Link>
      </div>
    </div>
  );
}

export default TripDetailsPage;