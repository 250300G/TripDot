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
        const [tripRes, activitiesRes] = await Promise.all([
          axios.get(`${API_URL}/trips/${tripId}`),
          axios.get(`${API_URL}/activities?tripId=${tripId}`)
        ]);
        setTrip(tripRes.data);
        setActivities(activitiesRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tripId, API_URL]);

  if (loading) return <p className="text-center mt-5">Loading TripDot...</p>;
  if (error || !trip) return (
    <div className="text-center mt-5">
      <h3 className="text-danger">Oups ! no Trip found.</h3>
      <Link to="/trips" className="btn btn-dark mt-3">comeback to the list</Link>
    </div>
  );

  // Budget calculé depuis les activités
  const totalSpent = activities.reduce((sum, act) => sum + (Number(act.priceLocal) || 0), 0);
  const budget = Number(trip.budgetLimit) || 0;
  const budgetPercent = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;
  const overBudget = totalSpent > budget && budget > 0;

  return (
    <div className="container py-4">

      {/* Breadcrumb */}
      <nav className="mb-3" aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/trips" className="text-decoration-none text-muted">My trips</Link></li>
          <li className="breadcrumb-item active">{trip.destination}</li>
        </ol>
      </nav>

      <div className="row mb-4">
        <div className="col-md-6">
          <img
            src={trip.imageUrl || "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=800"}
            alt={trip.destination}
            className="img-fluid rounded shadow-sm mb-3"
            style={{ width: "100%", height: "300px", objectFit: "cover" }}
          />
        </div>
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h1 className="fw-bold m-0">{trip.destination}</h1>
            <span className={`badge ${trip.status === "done" ? "bg-success" : "bg-primary"}`}>
              {trip.status?.toUpperCase()}
            </span>
          </div>
          <p className="text-muted fs-5 mb-1">{trip.startDate} — {trip.endDate}</p>
          <p className="text-primary fw-bold mb-3">🌤️ Weather: {trip.currentWeather || "N/A"}</p>

          {/* Budget card avec total activités */}
          <div className="p-3 bg-white border rounded">
            <div className="d-flex justify-content-between mb-1">
              <p className="mb-0 text-secondary">Budget spent</p>
              <span className={`fw-bold ${overBudget ? "text-danger" : "text-success"}`}>
                {totalSpent} / {trip.budgetLimit} {trip.userCurrency}
              </span>
            </div>
            <div className="progress mb-1" style={{ height: "8px", borderRadius: "4px" }}>
              <div
                className="progress-bar"
                style={{
                  width: `${budgetPercent}%`,
                  backgroundColor: overBudget ? "#dc3545" : budgetPercent > 75 ? "#ffc107" : "#198754",
                  transition: "width 0.8s ease"
                }}
              />
            </div>
            {overBudget
              ? <small className="text-danger fw-semibold">⚠️ Over budget by {totalSpent - budget} {trip.userCurrency}</small>
              : <small className="text-muted">Remaining: {budget - totalSpent} {trip.userCurrency}</small>
            }
          </div>
        </div>
      </div>

      <hr className="my-4" />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Activities</h3>
        <Link to={`/activities/create?tripId=${trip.id}`} className="btn btn-outline-dark btn-sm">+ Add</Link>
      </div>

      {activities.length === 0 ? (
        <div className="alert alert-light border text-center py-4">Aucune activité enregistrée.</div>
      ) : (
        <div className="row g-3">
          {activities.map((activity) => (
            <div key={activity.id} className="col-12">
              <div className="card shadow-sm border-0 bg-white">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title fw-bold mb-1">{activity.title}</h5>
                    <p className="card-text text-muted mb-0 small">
                      {activity.time} • {activity.category?.toUpperCase()}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="fw-bold mb-1">
                      {activity.priceLocal} {trip.localCurrency}
                    </p>
                    <Link to={`/activities/edit/${activity.id}`} className="btn btn-sm btn-light border">Modify</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 pt-3 border-top d-flex gap-3">
        <Link to="/trips" className="btn btn-link text-dark p-0 text-decoration-none">← Retour</Link>
        <Link to={`/trips/edit/${trip.id}`} className="btn btn-outline-secondary ms-auto">Trip Parameters</Link>
      </div>
    </div>
  );
}

export default TripDetailsPage;
