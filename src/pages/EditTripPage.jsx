import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

function EditTripPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_SERVER_URL;

  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");
  const [status, setStatus] = useState("planned");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On charge les données actuelles pour pré-remplir le formulaire
    axios.get(`${API_URL}/trips/${tripId}`)
      .then((res) => {
        const trip = res.data;
        setDestination(trip.destination);
        setStartDate(trip.startDate);
        setEndDate(trip.endDate);
        setBudgetLimit(trip.budgetLimit);
        setStatus(trip.status);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [tripId, API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedTrip = {
      destination,
      startDate,
      endDate,
      budgetLimit: Number(budgetLimit),
      status
    };

    try {
      // PATCH permet de ne pas écraser l'image (imageUrl)
      await axios.patch(`${API_URL}/trips/${tripId}`, updatedTrip);
      navigate(`/trips/${tripId}`); // Retour à la page Details
    } catch (error) {
      console.error("Error updating trip:", error);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading form...</p>;

  return (
    <div className="container py-4">
      <div className="mb-3 text-start">
        <Link to={`/trips/${tripId}`} className="btn btn-link text-dark p-0">← Cancel</Link>
      </div>

      <div className="form-container mx-auto" style={{ maxWidth: "500px" }}>
        <h2 className="fw-bold mb-4">Edit Trip Settings</h2>
        


        <Link to={`/trips/${tripId}`} className="btn btn-outline-secondary w-100 mt-2">Cancel</Link>
        <form onSubmit={handleSubmit} className="text-start">
          <div className="mb-3">
            <label className="form-label">Destination</label>
            <input type="text" className="form-control" value={destination} onChange={(e) => setDestination(e.target.value)} required />
          </div>

          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Start Date</label>
              <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="col">
              <label className="form-label">End Date</label>
              <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Budget Limit</label>
            <input type="number" className="form-control" value={budgetLimit} onChange={(e) => setBudgetLimit(e.target.value)} />
          </div>

          <div className="mb-4">
            <label className="form-label">Status</label>
            <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="planned">Coming</option>
              <option value="ongoing">Current</option>
              <option value="done">Past</option>
            </select>
          </div>

          <button type="submit" className="btn btn-dark w-100 py-2">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default EditTripPage;