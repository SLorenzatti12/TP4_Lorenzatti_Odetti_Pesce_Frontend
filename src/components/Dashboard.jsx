import '../estilos/Dashboard.css';
import { Outlet, NavLink } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <NavLink to="anual" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Vista Anual</NavLink>
        <NavLink to="mensual" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Vista Mensual</NavLink>
        <NavLink to="semanal" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Vista Semanal</NavLink>
      </nav>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;