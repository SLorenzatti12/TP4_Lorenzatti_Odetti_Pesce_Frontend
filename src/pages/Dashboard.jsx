import { Routes, Route, NavLink } from "react-router-dom";
import VistaAnual from "../components/calendar/VistaAnual";
import VistaMensual from "../components/calendar/VistaMensual";
import VistaSemanal from "../components/calendar/VistaSemanal";
import VistaDiaria from "../components/calendar/VistaDiaria";

const Dashboard = () => {
    return (
        <div>
            <nav>
                <NavLink to="year">Año</NavLink>
                <NavLink to="month">Mes</NavLink>
                <NavLink to="week">Semana</NavLink>
                <NavLink to="day">Día</NavLink>
            </nav>
            <Routes>
                <Route path="year" element={<VistaAnual />}/>
                <Route path="month" element={<VistaMensual />}/>
                <Route path="week" element={<VistaSemanal />}/>
                <Route path="day" element={<VistaDiaria />}/>
            </Routes>
        </div>
    );
};

export default Dashboard;

