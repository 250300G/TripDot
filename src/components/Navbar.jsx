import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold">
          Trip<span className="text-primary">Dot</span>
        </Link>
        <Link to="/trips" className="btn btn-outline-light btn-sm">My Trips</Link>
      </div>
    </nav>
  );
}

export default Navbar;