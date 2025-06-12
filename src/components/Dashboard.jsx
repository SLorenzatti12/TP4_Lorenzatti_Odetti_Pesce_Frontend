import { Routes, Route, NavLink } from 'react-router-dom';
import VistaAnual from './Calendar/VistaAnual';
import VistaMensual from './Calendar/VistaMensual';
import VistaSemanal from './Calendar/VistaSemanal';
//import VistaDiaria from './Calendar/VistaDiaria';
import '../estilos/Dashboard.css'; // Puedes crear este archivo para estilos personalizados


function Dashboard() {
  return (
    <div className="dashboard">
      <nav>
        <ul>
          <li><Link to="anual">Vista Anual</Link></li>
          <li><Link to="mensual">Vista Mensual</Link></li>
          <li><Link to="semanal">Vista Semanal</Link></li>
          {/* <li><Link to="diaria">Vista Diaria</Link></li> */}
        </ul>
      </nav>

      <div className="vista">
        <Routes>
          <Route path="anual" element={<VistaAnual />} />
          <Route path="mensual" element={<VistaMensual />} />
          <Route path="semanal" element={<VistaSemanal />} />
          {/* <Route path="diaria" element={<VistaDiaria />} /> */}
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;