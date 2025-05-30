import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import {jwtDecode} from 'jwt-decode';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: username, password }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Credenciales inválidas');
      }
      const data = await response.json();
      const token = data.token;
      const decodedToken = jwtDecode(token);
      const role = decodedToken.role ? decodedToken.role.toLowerCase() : null; // Convertir a minúsculas

      if (!role) {
        throw new Error('Rol no encontrado en el token');
      }

      setAuth({ token }); // Guardar solo el token en el contexto
      localStorage.setItem('token', token); // Guardar token en localStorage

      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'vendedor') {
        navigate('/seller');
      } else {
        throw new Error('Rol no reconocido: ' + role);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center min-vh-100"
      style={{ backgroundColor: '#f8f9fa' }}
    >
      <div className="text-center mb-5">
        <h1
          className="mb-4"
          style={{
            fontFamily: "'Lobster', cursive",
            fontSize: '4rem',
            color: '#343a40',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          Panadero Digital
        </h1>
      </div>
      <div className="col-12 col-md-8 col-lg-6">
        <div className="card shadow p-4">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Usuario</label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button onClick={handleLogin} className="btn btn-primary w-100">Iniciar Sesión</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;