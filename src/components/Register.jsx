import { useState } from 'react';
import axios from 'axios';
import '../styles/FormBase.css';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/api/users/signup', {
        nombre: username,
        email,
        contraseña: password
  });

    console.log(res.data); // { mensaje, id }

    setError('');
    navigate('/'); // Redirige al login
  } catch (err) {
    if (err.response) {
      setError(err.response.data.error || 'Error al registrar usuario');
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
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
    </>
  );
}

export default Register;