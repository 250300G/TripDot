import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function CreateTripPage() {
  const navigate = useNavigate();
  
  // Récupération sécurisée des variables d'environnement
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
      // --- Appel API Météo Sécurisé ---
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
      <h3 className="fw-bold mb-4">✈️ New Trip</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Destination *</label>
          <input type="text" className="form-control" value={destination} onChange={(e) => setDestination(e.target.value)} required />
        </div>
        {/* ... (Reste du formulaire identique) ... */}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-dark flex-grow-1" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2" /> : "Create Trip"}
          </button>
          <Link to="/trips" className="btn btn-outline-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

export default CreateTripPage;