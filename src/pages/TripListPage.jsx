import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TripCard from "../components/TripCard"; 

function TripListPage() {
  // On initialise à null pour savoir si le premier chargement est en cours
  const [allTrips, setAllTrips] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/trips`);
      // Sécurité : on s'assure de recevoir un tableau pour ne pas casser le .filter() plus bas
      const data = Array.isArray(response.data) ? response.data : [];
      setAllTrips(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      // En cas d'erreur, on met un tableau vide pour éviter le chargement infini
      setAllTrips([]);
    } finally {
      // Quoi qu'il arrive, on arrête le spinner
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // 🔍 Filtrage par destination (sécurisé avec filteredTrips initialisé à [])
  const filteredTrips = allTrips
    ? allTrips.filter((trip) =>
        trip.destination?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Affichage du spinner pendant le chargement
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-dark" role="status" />
        <p className="mt-3 text-muted">Loading your journeys...</p>
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

      {/* EMPTY STATE ou LISTE */}
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
            <TripCard key={trip.id} trip={trip} /> 
          ))}
        </div>
      )}
    </div>
  );
}

export default TripListPage;