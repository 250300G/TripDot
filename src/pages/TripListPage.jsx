import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TripCard from "../components/TripCard"; 

function TripListPage() {
  const [allTrips, setAllTrips] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // --- AJOUT DE LA FONCTION DE SUPPRESSION ICI ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/trips/${id}`);
      // On met à jour l'interface immédiatement en filtrant le voyage supprimé
      setAllTrips(allTrips.filter(trip => trip.id !== id));
    } catch (error) {
      console.error("Error deleting trip:", error);
      alert("Failed to delete the trip.");
    }
  };
  // ----------------------------------------------

  const getData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/trips`);
      const data = Array.isArray(response.data) ? response.data : [];
      setAllTrips(data);
    } catch (error) {
      console.error(error);
      setAllTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const filteredTrips = allTrips
    ? allTrips
        .slice()
        .sort((a, b) => {
          if (!a.startDate && b.startDate) return 1;
          if (a.startDate && !b.startDate) return -1;
          if (a.status === "done" && b.status !== "done") return 1;
          if (a.status !== "done" && b.status === "done") return -1;
          return new Date(a.startDate) - new Date(b.startDate);
        })
        .filter((trip) =>
          trip.destination?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : [];

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-dark" role="status" />
        <p className="mt-3 text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="TripListPage py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">My trips</h2>
        <Link to="/trips/create" className="btn btn-dark btn-sm px-3">
          + New Trip
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Rechercher une destination..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

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
            // --- ON PASSE LA FONCTION HANDLEDELETE ICI ---
            <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TripListPage;