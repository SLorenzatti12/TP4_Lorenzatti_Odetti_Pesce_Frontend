import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const isLoggedIn = localStorage.getItem('user');


  return(
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Dashboard />} />
      </Routes>
    </Router>
    <VistaMensual></VistaMensual>
    </>
  );
}

export default App;