import { Link } from "react-router-dom";

function TripCard({ trip}) {
  // Logique pour déterminer la couleur du badge selon le statut
  const getStatusBadge = (status) => {
    switch (status) {
      case "done":
        return <span className="badge bg-success">Past</span>;
      case "ongoing":
        return <span className="badge bg-warning text-dark">Current</span>;
      default:
        return <span className="badge bg-primary">Coming</span>;
    }
  };

  return (
    
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm border-0 transition-hover">
        {/* Image du voyage avec overlay pour le statut */}
        <div className="position-relative">
          <img
            src={trip.imageUrl || "https://via.placeholder.com/400x250?text=No+Image"}
            className="card-img-top"
            alt={trip.destination}
            style={{ height: "200px", objectFit: "cover" }}
          />
          <div className="position-absolute top-0 end-0 m-2">
            {getStatusBadge(trip.status)}
          </div>
        </div>

        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title fw-bold mb-0">{trip.destination}</h5>
            {trip.isFavorite && <span className="text-danger">❤️</span>}
          </div>

          <p className="card-text text-muted small mb-3">
            <i className="bi bi-calendar-event me-2"></i>
            {trip.startDate} — {trip.endDate}
          </p>

          <div className="mt-auto d-flex justify-content-between align-items-center">
            <div className="text-secondary small">
              Budget: <strong>{trip.budgetLimit} {trip.userCurrency}</strong>
            </div>
            
            {/* Lien vers la page détails avec l'id dynamique */}
            <Link to={`/trips/${trip.id}`} className="btn btn-dark btn-sm px-3 shadow-none">
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripCard;