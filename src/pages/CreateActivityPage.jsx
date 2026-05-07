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
  const [priceLocal, setPriceLocal] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Sécurité: on s'assure que tripId existe (Ligne 19)
    if (!tripId) {
        alert("Error: No Trip ID found");
        return;
    }

    const newActivity = { 
        tripId: tripId,
        title, 
        time, 
        category, 
        priceLocal: Number(priceLocal) || 0, 
        isCompleted: false 
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
      
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm border">
        <div className="mb-3">
          <label className="form-label fw-bold">Title</label>
          <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="E.g. Eiffel Tower" required />
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label fw-bold">Time</label>
            <input type="time" className="form-control" value={time} onChange={(e) => setTime(e.target.value)} required />
          </div>
          <div className="col">
            <label className="form-label fw-bold">Category</label>
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="activity">🎯 Activity</option>
              <option value="food">🍽️ Food</option>
              <option value="transport">🚗 Transport</option>
              <option value="sport">🏊 sport</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label fw-bold">Local Price</label>
          <input type="number" className="form-control" value={priceLocal} onChange={(e) => setPriceLocal(e.target.value)} />
        </div>

        <button type="submit" className="btn btn-dark w-100 mb-2">Save Activity</button>
        <Link to={`/trips/${tripId}`} className="btn btn-outline-secondary w-100">Cancel</Link>
      </form>
    </div>
  );
}

export default CreateActivityPage;