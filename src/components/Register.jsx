import { useState } from 'react';
import '../estilos/Login.css'; // Reutiliza los estilos del Login
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Guardado temporal en localStorage (puede cambiarse por backend)
    const userData = { username, password };
    localStorage.setItem('registeredUser', JSON.stringify(userData));

    setError('');
    navigate('/'); // Redirige al login
  };

  return (
    <div className="login-container">
      <h2>Registro de Usuario</h2>
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

        <label>
          Confirmar Contraseña:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit">Registrarse</button>
        <button
          type="button"
          className="registro-btn"
          onClick={() => navigate('/')}
        >
          ¿Ya tenés cuenta? Iniciar sesión
        </button>
      </form>
    </div>
  );
}

export default Register;