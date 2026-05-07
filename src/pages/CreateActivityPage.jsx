import { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

function CreateActivityPage() {
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("tripId");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_SERVER_URL;

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("activity");
  const [priceLocal, setPriceLocal] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newActivity = { tripId, title, time, category, priceLocal: Number(priceLocal), isCompleted: false };
    try {
      await axios.post(`${API_URL}/activities`, newActivity);
      navigate(`/trips/${tripId}`);
    } catch (error) {
      console.error("Erreur lors de la création :", error);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: "600px" }}>
      <nav className="mb-4" aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/trips" className="text-decoration-none text-muted">My trips</Link></li>
          {tripId && <li className="breadcrumb-item"><Link to={`/trips/${tripId}`} className="text-decoration-none text-muted">Trip Details</Link></li>}
          <li className="breadcrumb-item active">New Activity</li>
        </ol>
      </nav>
      <h3 className="fw-bold mb-4">Ajouter une activité</h3>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Nom de l'activité</label>
          <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Heure</label>
            <input type="time" className="form-control" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Catégorie</label>
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="food">🍽️ Restauration</option>
              <option value="transport">🚗 Transport</option>
              <option value="activity">🎯 Activité</option>
              <option value="accommodation">🏨 Hébergement</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="form-label">Prix (local)</label>
          <input type="number" className="form-control" value={priceLocal} onChange={(e) => setPriceLocal(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-dark w-100">Créer l'activité</button>
        <Link to={`/trips/${tripId}`} className="btn btn-link w-100 mt-2 text-dark text-decoration-none">Annuler</Link>
      </form>
    </div>
  );
}

export default CreateActivityPage;
