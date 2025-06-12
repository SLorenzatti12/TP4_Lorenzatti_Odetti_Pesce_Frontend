import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from "./components/Login";
import VistaSemanal from './components/calendar/VistaSemanal';

function App() {
  const isLoggedIn = localStorage.getItem('user');


  return(
    <>
    <VistaSemanal semana={`S1`}></VistaSemanal>
    </>
  );
}

export default App;