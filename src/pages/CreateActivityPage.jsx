import { useState, useEffect } from "react"; // Ajout de useEffect
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
  const [priceLocal, setPriceLocal] = useState("");

  // Nouveaux états pour gérer les jours du voyage
  const [dayNumber, setDayNumber] = useState("");
  const [availableDays, setAvailableDays] = useState([]);

  // Récupération des dates du voyage au chargement
  useEffect(() => {
    const fetchTripDates = async () => {
      try {
        const res = await axios.get(`${API_URL}/trips/${tripId}`);
        const start = new Date(res.data.startDate);
        const end = new Date(res.data.endDate);
        const diffDays =
          Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;

        const days = Array.from({ length: diffDays }, (_, i) => {
          const date = new Date(start);
          date.setDate(start.getDate() + i);
          return {
            num: i + 1,
            label: date.toLocaleDateString("fr-FR", {
              weekday: "short",
              day: "numeric",
            }),
          };
        });
        setAvailableDays(days);
      } catch (err) {
        console.error("Erreur dates:", err);
      }
    };
    if (tripId) fetchTripDates();
  }, [tripId, API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tripId) {
      alert("Error: No Trip ID found");
      return;
    }

    const newActivity = {
      tripId: tripId,
      title,
      time,
      category,
      dayNumber: Number(dayNumber), // On ajoute le jour sélectionné
      priceLocal: Number(priceLocal) || 0,
      isCompleted: false,
    };

    try {
      await axios.post(`${API_URL}/activities`, newActivity);
      navigate(`/trips/${tripId}`);
    } catch (error) {
      console.error("Erreur création :", error);
    }
  };

  return (
    <div className="container py-5 text-start" style={{ maxWidth: "500px" }}>
      <h3 className="fw-bold mb-4 text-center">New Activity</h3>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow-sm border"
      >
        <div className="mb-3">
          <label className="form-label fw-bold">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g. Eiffel Tower"
            required
          />
        </div>

   
        <div className="mb-3">
          <label className="form-label fw-bold d-block">When?</label>
          <div className="d-flex flex-wrap gap-2">
            {availableDays.map((day) => (
              <div key={day.num}>
                <input
                  type="radio"
                  className="btn-check"
                  name="daySelect"
                  id={`day-${day.num}`}
                  onChange={() => setDayNumber(day.num)}
                  required
                />
                <label
                  className="btn btn-outline-dark btn-sm p-2"
                  htmlFor={`day-${day.num}`}
                  style={{ borderRadius: "10px", minWidth: "70px" }}
                >
                  <small className="d-block fw-bold">Day {day.num}</small>
                  <span style={{ fontSize: "0.7rem" }}>{day.label}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label fw-bold">Time</label>
            <input
              type="time"
              className="form-control"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          <div className="col">
            <label className="form-label fw-bold">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="activity">🎯 Activity</option>
              <option value="food">🍽️ Food</option>
              <option value="transport">🚗 Transport</option>
              <option value="sport">🏊 sport</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold">Local Price</label>
          <input
            type="number"
            className="form-control"
            value={priceLocal}
            onChange={(e) => setPriceLocal(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-dark w-100 mb-2">
          Save Activity
        </button>
        <Link
          to={`/trips/${tripId}`}
          className="btn btn-outline-secondary w-100"
        >
          Cancel
        </Link>
      </form>
    </div>
  );
}

export default CreateActivityPage;
