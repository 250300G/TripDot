import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function CreateTripPage() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_SERVER_URL;

  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");
  const [userCurrency, setUserCurrency] = useState("EUR");
  const [imageUrl, setImageUrl] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const newTrip = {
      destination,
      startDate,
      endDate,
      budgetLimit: Number(budgetLimit),
      userCurrency,
      localCurrency: userCurrency,
      imageUrl: imageUrl || `https://source.unsplash.com/800x600/?${destination},travel`,
      isFavorite,
      status: "planned",
    };

    try {
      const response = await axios.post(`${API_URL}/trips`, newTrip);
      navigate(`/trips/${response.data.id}`);
    } catch (err) {
      console.log(err);
      setError("Une erreur est survenue. Vérifie que le serveur est bien lancé.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="CreateTripPage py-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h3 className="fw-bold mb-4">✈️ Nouveau voyage</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Destination *</label>
          <input
            type="text"
            className="form-control"
            placeholder="ex: Tokyo, Lisbonne..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label fw-semibold">Date de départ *</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="col">
            <label className="form-label fw-semibold">Date de retour *</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label fw-semibold">Budget (€)</label>
            <input
              type="number"
              className="form-control"
              placeholder="ex: 2000"
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(e.target.value)}
              min="0"
            />
          </div>
          <div className="col">
            <label className="form-label fw-semibold">Devise</label>
            <select
              className="form-select"
              value={userCurrency}
              onChange={(e) => setUserCurrency(e.target.value)}
            >
              <option value="EUR">EUR €</option>
              <option value="USD">USD $</option>
              <option value="GBP">GBP £</option>
              <option value="JPY">JPY ¥</option>
              <option value="CHF">CHF</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">URL de l'image (optionnel)</label>
          <input
            type="url"
            className="form-control"
            placeholder="https://..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <div className="mb-4 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="isFavorite"
            checked={isFavorite}
            onChange={(e) => setIsFavorite(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="isFavorite">
            ❤️ Ajouter aux favoris
          </label>
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-dark flex-grow-1" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" />
            ) : null}
            Créer le voyage
          </button>
          <Link to="/trips" className="btn btn-outline-secondary">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CreateTripPage;
