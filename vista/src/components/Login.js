import React, { useState } from 'react';
import { api } from '../utils/api';

const Login = ({ setToken, setUserData }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const credentials = {
        correo: username,
        password: password
      };

      const data = await api.login(credentials);
      console.log('Login exitoso:', data);

      if (data && data.token) {
        setToken(data.token);
        setUserData({
          correo: data.correo,
          nombres: data.nombres,
          apellidos: data.apellidos,
          rol: data.rol
        });
      } else {
        throw new Error('No se recibió el token en la respuesta');
      }
    } catch (err) {
      console.error('Error durante el login:', err);
      setError(err.message || 'Error al intentar iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const fillTestCredentials = () => {
    setUsername('juan.perez@gmail.com');
    setPassword('password123');
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
              
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Close"></button>
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="ejemplo@correo.com"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Ingrese su contraseña"
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mb-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </button>
                
                <button 
                  type="button"
                  className="btn btn-outline-secondary w-100"
                  onClick={fillTestCredentials}
                  disabled={loading}
                >
                  Cargar credenciales de prueba
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;