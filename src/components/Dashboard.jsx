import { Routes, Route, NavLink } from 'react-router-dom';
import VistaAnual from './Calendar/VistaAnual';
import VistaMensual from './Calendar/VistaMensual';
import VistaSemanal from './Calendar/VistaSemanal';
//import VistaDiaria from './Calendar/VistaDiaria';
import '../estilos/Dashboard.css'; // Puedes crear este archivo para estilos personalizados

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <NavLink to="year" className="nav-link">Año</NavLink>
        <NavLink to="month" className="nav-link">Mes</NavLink>
        <NavLink to="week" className="nav-link">Semana</NavLink>
        {/* <NavLink to="day" className="nav-link">Día</NavLink> */}
      </nav>

      <main className="dashboard-main">
        <Routes>
          <Route path="year" element={<VistaAnual />} />
          <Route path="month" element={<VistaMensual />} />
          <Route path="week" element={<VistaSemanal />} />
          {/* <Route path="day" element={<VistaDiaria />} /> */}
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;