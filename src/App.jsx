import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import VistaAnual from './components/calendar/VistaAnual';
import VistaMensual from './components/calendar/VistaMensual';
import VistaSemanal from './components/calendar/VistaSemanal';
import { MesProvider } from '../contexs/MesContext';
import { PlanificacionProvider } from '../contexs/PlanificacionContext';
// import VistaDiaria from './components/Calendar/VistaDiaria';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

return (
  <>
    <div id="bg-espiral"></div>
    <MesProvider>
      <PlanificacionProvider>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login onLoginSuccess={() => setIsAuthenticated(true)} />
              )
            }
          />
          <Route path="register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/" />
            }
          >
            <Route index element={<VistaAnual />} />
            <Route path="anual" element={<VistaAnual />} />
            <Route path="mensual" element={<VistaMensual />} />
            <Route path="semanal" element={<VistaSemanal />} />
          </Route>
        </Routes>
      </PlanificacionProvider>
    </MesProvider>
  </>
);
}

export default App;