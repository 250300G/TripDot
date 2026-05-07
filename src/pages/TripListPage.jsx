import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TripCard from "../components/TripCard"; 

function TripListPage() {
  const [allTrips, setAllTrips] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce voyage ?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/trips/${id}`);
      setAllTrips(allTrips.filter(trip => trip.id !== id));
    } catch (error) { console.error(error); }
  };

  const getData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/trips`);
      setAllTrips(Array.isArray(response.data) ? response.data : []);
    } catch (error) { setAllTrips([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { getData(); }, []);

  const filteredTrips = allTrips ? allTrips.filter(t => t.destination?.toLowerCase().includes(searchQuery.toLowerCase())) : [];

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;

  return (
    <div className="TripListPage py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Mes voyages</h4>
        <Link to="/trips/create" className="btn btn-dark btn-sm">+ Nouveau</Link>
      </div>

      <input 
        type="text" 
        className="form-control form-control-sm mb-4 shadow-sm" 
        placeholder="🔍 Chercher..." 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
      />

      <div className="row gx-2"> {/* gx-2 réduit l'espace entre les cartes */}
        {filteredTrips.map((trip) => (
          <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

export default TripListPage;