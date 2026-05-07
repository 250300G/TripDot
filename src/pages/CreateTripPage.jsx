import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function CreateTripPage() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_SERVER_URL;
  const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

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

    try {
      let weatherInfo = "No data";
      if (WEATHER_API_KEY) {
        try {
          const weatherRes = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${destination}&units=metric&appid=${WEATHER_API_KEY}`
          );
          weatherInfo = `${Math.round(weatherRes.data.main.temp)}°C, ${weatherRes.data.weather[0].main}`;
        } catch (wErr) {
          console.error("Weather API Error:", wErr);
        }
      }

      const newTrip = {
        destination,
        startDate,
        endDate,
        budgetLimit: Number(budgetLimit),
        userCurrency,
        localCurrency: userCurrency,
        imageUrl: imageUrl || `https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=800`,
        isFavorite,
        status: "planned",
        currentWeather: weatherInfo
      };

      const response = await axios.post(`${API_URL}/trips`, newTrip);
      navigate(`/trips/${response.data.id}`);
    } catch (err) {
      setError("Server error. Please check if your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="CreateTripPage py-4" style={{ maxWidth: "600px", margin: "0 auto" }}>

      {/* Breadcrumb */}
      <nav className="mb-4" aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/trips" className="text-decoration-none text-muted">My trips</Link></li>
          <li className="breadcrumb-item active">New Trip</li>
        </ol>
      </nav>

      <h3 className="fw-bold mb-4">✈️ New Trip</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>

        {/* Destination */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Destination *</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Paris, Tokyo, New York..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>

        {/* Dates */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">End Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Budget */}
        <div className="row">
          <div className="col-md-8 mb-3">
            <label className="form-label fw-semibold">Budget Limit</label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 1500"
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(e.target.value)}
              min="0"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Currency</label>
            <select className="form-select" value={userCurrency} onChange={(e) => setUserCurrency(e.target.value)}>
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
        </div>

        {/* Image URL */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Image URL</label>
          <input
            type="url"
            className="form-control"
            placeholder="https://..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="preview"
              className="mt-2 rounded"
              style={{ width: "100%", height: "120px", objectFit: "cover" }}
            />
          )}
        </div>

        {/* Favorite */}
        <div className="mb-4 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="isFavorite"
            checked={isFavorite}
            onChange={(e) => setIsFavorite(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="isFavorite">
            ❤️ Mark as favorite
          </label>
        </div>

        {/* Actions */}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-dark flex-grow-1" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
            Create Trip
          </button>
          <Link to="/trips" className="btn btn-outline-secondary">Cancel</Link>
        </div>

      </form>
    </div>
  );
}

export default CreateTripPage;
