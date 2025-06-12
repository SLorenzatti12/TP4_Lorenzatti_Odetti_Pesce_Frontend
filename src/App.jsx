import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import VistaAnual from './components/calendar/VistaAnual';
import VistaMensual from './components/calendar/VistaMensual';
import VistaSemanal from './components/calendar/VistaSemanal';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Routes>
      <Route path="/" element={ isAuthenticated ? (<Navigate to="/dashboard" />) : (<Login onLoginSuccess={() => setIsAuthenticated(true)} />)}/>
      
      <Route path="/dashboard" element={ isAuthenticated ? <Dashboard /> : <Navigate to="/" />}>
        <Route index element={<VistaAnual />} />
        <Route path="mensual" element={<VistaMensual />} />
        <Route path="semanal" element={<VistaSemanal />} />
        
      </Route>
    </Routes>
  );
}

export default App;