function Login({ onLoginSuccess }) {
    const handleLogin = () => {
      // Aquí podrías verificar credenciales, etc.
    //   onLoginSuccess(); // Simula un login exitoso
    };
  
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Iniciar Sesión</h2>
        <button onClick={handleLogin}>Ingresar</button>
      </div>
    );
  }
  
  export default Login;