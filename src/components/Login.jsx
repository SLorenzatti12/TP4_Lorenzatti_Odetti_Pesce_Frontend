import { useState } from 'react';
import '../estilos/Login.css'; // Si querés estilos personalizados
import { useNavigate } from 'react-router-dom';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const storedUser = JSON.parse(localStorage.getItem('registeredUser'));
  
    if (storedUser && username === storedUser.username && password === storedUser.password) {
      setError('');
      onLoginSuccess(); // Login exitoso
    } else {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="login-container">
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
        <button className="registro-btn" onClick={() => navigate('/register')}>
            ¿No tienes cuenta? Registrate
        </button>
        
      </form>
    </div>
  );
}

export default Login;