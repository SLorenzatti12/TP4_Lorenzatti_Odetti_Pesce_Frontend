import '../estilos/Dashboard.css';
import { Outlet, NavLink } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="dashboard">
      <nav>
        <ul>
          <li><NavLink to="anual">Vista Anual</NavLink></li>
          <li><NavLink to="mensual">Vista Mensual</NavLink></li>
          <li><NavLink to="semanal">Vista Semanal</NavLink></li>
        </ul>
      </nav>

      <div className="vista">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;