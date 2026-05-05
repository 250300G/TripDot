import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

function EditActivityPage() {
  const navigate = useNavigate();
  const { activityId } = useParams(); // ✅ activityId (pas projectId)

  const API_URL = import.meta.env.VITE_SERVER_URL;

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");
  const [priceLocal, setPriceLocal] = useState("");
  const [tripId, setTripId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(`${API_URL}/activities/${activityId}`); // ✅ /activities
      const activity = response.data;

      setTitle(activity.title);
      setTime(activity.time || "");
      setCategory(activity.category || "");
      setPriceLocal(activity.priceLocal || "");
      setTripId(activity.tripId);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const body = { title, time, category, priceLocal, tripId };

    try {
      await axios.put(`${API_URL}/activities/${activityId}`, body); // ✅ /activities
      navigate(`/trips/${tripId}`); // ✅ retour vers le bon trip
    } catch (error) {
      console.log(error);
    }
  };

  const deleteActivity = async () => {
    if (!window.confirm("Supprimer cette activité ?")) return;
    try {
      await axios.delete(`${API_URL}/activities/${activityId}`); // ✅ /activities
      navigate(`/trips/${tripId}`);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-dark" role="status" />
      </div>
    );
  }

  return (
    <div className="EditActivityPage py-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h3 className="fw-bold mb-4">Modifier l'activité</h3>

      <form onSubmit={handleFormSubmit}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Titre</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Heure</label>
          <input
            type="time"
            className="form-control"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Catégorie</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">-- Choisir --</option>
            <option value="food">🍽️ Restauration</option>
            <option value="transport">🚗 Transport</option>
            <option value="activity">🎯 Activité</option>
            <option value="accommodation">🏨 Hébergement</option>
            <option value="other">📌 Autre</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Prix (devise locale)</label>
          <input
            type="number"
            className="form-control"
            value={priceLocal}
            onChange={(e) => setPriceLocal(e.target.value)}
            min="0"
          />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-dark flex-grow-1">
            Enregistrer
          </button>
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={deleteActivity}
          >
            Supprimer
          </button>
        </div>
      </form>

      {tripId && (
        <div className="mt-3">
          <Link to={`/trips/${tripId}`} className="text-muted text-decoration-none small">
            ← Retour au voyage
          </Link>
        </div>
      )}
    </div>
  );
}

export default EditActivityPage; // ✅ nom cohérent avec App.jsx
