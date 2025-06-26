import '../styles/Dashboard.css';
import { Outlet, NavLink, useLocation } from 'react-router-dom';

function Dashboard() {
  const location = useLocation();
  const isAnualActive =
    location.pathname === '/dashboard' || location.pathname === '/dashboard/anual';

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <NavLink
          to="/dashboard/anual"
          className={() => isAnualActive ? "nav-link active" : "nav-link"}
        >
          Vista Anual
        </NavLink>
        <NavLink
          to="/dashboard/mensual"
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          Vista Mensual
        </NavLink>
        <NavLink
          to="/dashboard/semanal"
          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
        >
          Vista Semanal
        </NavLink>
      </nav>
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
