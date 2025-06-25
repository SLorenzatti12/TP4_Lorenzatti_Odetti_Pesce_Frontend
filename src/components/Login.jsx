import { useState } from 'react';
import axios from 'axios';
import '../styles/FormBase.css';
import { useNavigate } from 'react-router-dom';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3000/api/users/login', {
        nombre: username,
        contraseña: password
      });

      const { token } = res.data;
      localStorage.setItem('token', token);
      setError('');
      onLoginSuccess();
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'Error en el login');
      } else {
        setError('Error de red');
      }
    }
  };

  return (
    <>
      <div className="barra-header-agenda">
        <img src="/logo-agenda.png" alt="Logo Agenda Universitaria" className="logo-header" />
        <span className="titulo-header">Agenda Universitaria</span>
      </div>
      <div className="form-container">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Usuario:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            Contraseña:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit">Ingresar</button>
          <button
            type="button"
            className="registro-btn"
            onClick={() => navigate('/register')}
          >
            ¿No tenés cuenta? Registrate
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
