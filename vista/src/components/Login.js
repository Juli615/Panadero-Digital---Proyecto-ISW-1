import React, { useState } from 'react';

const Login = ({ setToken, setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error('Credenciales inválidas');
      const data = await response.json();
      setToken(data.token);
      setUser({ role: data.role });
      localStorage.setItem('token', data.token);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-card">
      <h2>Iniciar Sesión</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;