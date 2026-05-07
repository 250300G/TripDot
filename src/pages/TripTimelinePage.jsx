import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function TripTimelinePage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripRes, actRes] = await axios.all([
          axios.get(`${import.meta.env.VITE_SERVER_URL}/trips/${id}`),
          axios.get(`${import.meta.env.VITE_SERVER_URL}/activities?tripId=${id}`)
        ]);
        setTrip(tripRes.data);
        setActivities(actRes.data.sort((a, b) => a.dayNumber - b.dayNumber || a.time.localeCompare(b.time)));
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;

  const days = [...new Set(activities.map(a => a.dayNumber))];

  return (
    <div className="container py-4 text-start">
      {/* Header avec Météo Colorée */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold mb-0">{trip?.destination}</h2>
          <span className="text-muted">{trip?.startDate} — {trip?.endDate}</span>
        </div>
        <div className="text-end">
          <div className="fs-2">
             {trip?.currentWeather?.includes("Sun") || trip?.currentWeather?.includes("Clear") ? "☀️" : "⛅"}
          </div>
          <span className="fw-bold">{trip?.currentWeather?.split(',')[0]}</span>
        </div>
      </div>

      {/* LA TIMELINE */}
      <div className="position-relative">
        {/* Ligne verticale grise en fond */}
        <div className="position-absolute h-100" style={{ width: "2px", backgroundColor: "#dee2e6", left: "20px", zIndex: 0 }}></div>

        {days.map(dayNum => {
          const dayActs = activities.filter(a => a.dayNumber === dayNum);
          const dayTotal = dayActs.reduce((sum, a) => sum + Number(a.priceLocal || 0), 0);

          return (
            <div key={dayNum} className="mb-5 position-relative" style={{ zIndex: 1 }}>
              {/* Badge Jour */}
              <div className="d-flex align-items-center mb-4">
                <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: "42px", height: "42px", fontWeight: "bold" }}>
                  D{dayNum}
                </div>
                <div className="ms-3">
                    <h5 className="fw-bold mb-0">Étape du jour</h5>
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle">Budget: {dayTotal} {trip?.userCurrency}</span>
                </div>
              </div>

              {/* Liste des activités sur la ligne */}
              <div className="ms-5">
                {dayActs.map((act, idx) => (
                  <div key={act.id} className="card border-0 shadow-sm mb-3" style={{ borderRadius: "12px" }}>
                    <div className="card-body p-3 d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <div className="text-muted me-3 fw-bold" style={{ fontSize: "0.8rem", minWidth: "50px" }}>{act.time}</div>
                        <div>
                          <div className="fw-bold">{act.title}</div>
                          <small className="text-muted text-uppercase" style={{ fontSize: "0.65rem" }}>{act.category}</small>
                        </div>
                      </div>
                      <div className="fw-bold text-dark">{act.priceLocal} {trip?.userCurrency}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TripTimelinePage;