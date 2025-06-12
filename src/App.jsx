import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const isLoggedIn = localStorage.getItem('user');


  return(
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to= "/dashboard/year" /> : <Login />}/>
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;