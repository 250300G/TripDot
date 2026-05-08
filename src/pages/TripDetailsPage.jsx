import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

function TripDetailsPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripRes, activitiesRes] = await Promise.all([
          axios.get(`${API_URL}/trips/${tripId}`),
          axios.get(`${API_URL}/activities?tripId=${tripId}`),
        ]);
        setTrip(tripRes.data);
        const sortedActivities = activitiesRes.data.sort((a, b) =>
          (a.time || "").localeCompare(b.time || ""),
        );
        setActivities(sortedActivities);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tripId, API_URL]);

  const totalCost = activities.reduce(
    (acc, curr) => acc + (Number(curr.priceLocal) || 0),
    0,
  );
  const isOverBudget = trip ? totalCost > trip.budgetLimit : false;

  const deleteTrip = async () => {
    if (!window.confirm("Delete this entire trip?")) return;
    await axios.delete(`${API_URL}/trips/${tripId}`);
    navigate("/trips");
  };

  if (loading || !trip) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container py-4 text-start">
      <Link to="/trips" className="btn btn-sm btn-outline-secondary mb-3">
        ← Back to My Trips
      </Link>

      <div className="row g-4 align-items-center">
        <div className="col-md-4">
          <img
            src={trip.imageUrl}
            className="img-fluid rounded shadow"
            alt="dest"
            style={{
              maxHeight: "200px",
              width: "100%",
              objectFit: "cover",
              borderRadius: "20px",
              border: "4px solid white",
            }}
          />
        </div>
        <div className="col-md-8">
          <h1 className="fw-bold">{trip.destination}</h1>
          <p className="text-muted mb-1">
            {trip.startDate} to {trip.endDate}
          </p>
          <p className="badge bg-info text-dark">
            ☀️ Météo prévue : {trip.weather || "Non disponible"}
          </p>

          <div
            className={`p-3 rounded mb-3 ${isOverBudget ? "bg-danger-subtle border border-danger" : "bg-light border"}`}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small d-block">Budget Limit</span>
                <span className="fw-bold fs-5">
                  {trip.budgetLimit} {trip.userCurrency}
                </span>
              </div>
              <div className="text-end">
                <span className="text-muted small d-block">
                  Total Activities
                </span>
                <span
                  className={`fw-bold fs-5 ${isOverBudget ? "text-danger" : "text-success"}`}
                >
                  {totalCost} {trip.userCurrency}
                </span>
              </div>
            </div>
            {isOverBudget && (
              <div className="text-danger small mt-2 fw-bold">
                ⚠️ Over budget by {totalCost - trip.budgetLimit}{" "}
                {trip.userCurrency} !
              </div>
            )}
          </div>

          <div className="d-flex gap-2">
            <button
              onClick={deleteTrip}
              className="btn btn-sm btn-outline-danger"
            >
              Delete Trip
            </button>
            <Link
              to={`/trips/edit/${trip.id}`}
              className="btn btn-sm btn-outline-dark"
            >
              Edit Settings
            </Link>
          </div>
        </div>
      </div>

      <hr className="my-5" />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold m-0">Daily Schedule</h3>
        <div className="d-flex gap-2">
          {/* BOUTON TIMELINE AJOUTÉ ICI */}
          <Link
            to={`/trips/${trip.id}/timeline`}
            className="btn btn-outline-dark"
          >
            🗓️ View Timeline
          </Link>
          <Link
            to={`/activities/create?tripId=${trip.id}`}
            className="btn btn-dark"
          >
            + Add Activity
          </Link>
        </div>
      </div>

      <div className="activities-list">
        {activities.length === 0 && (
          <p className="text-muted text-center">No activities planned yet.</p>
        )}
        {activities.map((act) => (
          <div
            key={act.id}
            className="activity-slot bg-white p-3 mb-2 shadow-sm d-flex justify-content-between align-items-center"
            style={{ borderLeft: "5px solid #212529" }}
          >
            <div className="d-flex align-items-center">
              <span className="badge bg-dark me-3" style={{ width: "60px" }}>
                {act.time || "--:--"}
              </span>
              <div>
                <h6 className="fw-bold mb-0">{act.title}</h6>
                <small className="text-muted text-capitalize">
                  {act.category}
                </small>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="fw-bold">
                {act.priceLocal} {trip.userCurrency}
              </span>
              <Link
                to={`/activities/edit/${act.id}`}
                className="btn btn-sm btn-light border"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TripDetailsPage;
