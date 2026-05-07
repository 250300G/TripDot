import { Link } from "react-router-dom";

function TripCard({ trip, onDelete }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "done": return <span className="badge bg-success">Past</span>;
      case "ongoing": return <span className="badge bg-warning text-dark">Current</span>;
      default: return <span className="badge bg-primary">Coming</span>;
    }
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm border-0">
        <div className="position-relative">
          {/* IMAGE RÉDUITE À 100px */}
          <img
            src={trip.imageUrl || "https://via.placeholder.com/400x100?text=No+Image"}
            className="card-img-top"
            alt={trip.destination}
            style={{ height: "100px", objectFit: "cover" }} 
          />
          
          {/* BADGE MÉTÉO EN OVERLAY */}
          {trip.weather && trip.weather !== "No data" && (
            <div className="position-absolute top-0 start-0 m-2">
              <span className="badge bg-white text-dark shadow-sm opacity-90">
                ☁️ {trip.weather}
              </span>
            </div>
          )}

          <div className="position-absolute top-0 end-0 m-2">
            {getStatusBadge(trip.status)}
          </div>
        </div>

        <div className="card-body d-flex flex-column p-2">
          <div className="d-flex justify-content-between align-items-start">
            <h6 className="fw-bold mb-0 text-truncate">{trip.destination}</h6>
            {trip.isFavorite && <span className="text-danger small">❤️</span>}
          </div>

          <p className="text-muted small mb-2" style={{ fontSize: "0.75rem" }}>
            {trip.startDate} — {trip.endDate}
          </p>

          <div className="mt-auto d-flex justify-content-between align-items-center">
            <span className="small fw-bold">{trip.budgetLimit} {trip.userCurrency}</span>
            <div className="d-flex gap-1">
              <Link to={`/trips/${trip.id}`} className="btn btn-dark btn-sm p-1 px-2" style={{fontSize: "0.7rem"}}>
                Details
              </Link>
              <button onClick={() => onDelete(trip.id)} className="btn btn-outline-danger btn-sm p-1 px-2" style={{fontSize: "0.7rem"}}>
                Suppr.
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripCard;