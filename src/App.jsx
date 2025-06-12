import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import VistaAnual from './components/Calendar/VistaAnual';
import VistaMensual from './components/Calendar/VistaMensual';
import VistaSemanal from './components/Calendar/VistaSemanal';
// import VistaDiaria from './components/Calendar/VistaDiaria';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Routes>
      <Route path="/" element={ isAuthenticated ? (<Navigate to="/dashboard" />) : (<Login onLoginSuccess={() => setIsAuthenticated(true)} />)}/>

      <Route path='register' element={<Register />}/>
      
      <Route path="/dashboard" element={ isAuthenticated ? <Dashboard /> : <Navigate to="/" />}>
        <Route index element={<VistaAnual />} />
        <Route path="mensual" element={<VistaMensual />} />
        <Route path="semanal" element={<VistaSemanal />} />
        
        {/* <Route path="diaria" element={<VistaDiaria />} /> */}
      </Route>
    </Routes>
  );
}

export default App;