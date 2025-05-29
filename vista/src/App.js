import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

  // Verificar si hay un token al cargar la app y obtener datos del usuario
  useEffect(() => {
    if (token) {
      const fetchUserData = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/user', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!response.ok) throw new Error('Token inválido');
          const data = await response.json();
          setUser({ role: data.role }); // Ajusta según la respuesta de tu backend
        } catch (err) {
          console.error('Error al validar token:', err.message);
          handleLogout(); // Si el token es inválido, cerrar sesión
        }
      };
      fetchUserData();
    }
  }, [token]);

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  };

  // Renderizar según el estado de autenticación
  return (
    <div className="container">
      <h1>Panadero Digital</h1>
      {token && user ? (
        <Dashboard token={token} user={user} onLogout={handleLogout} />
      ) : (
        <Login setToken={setToken} setUser={setUser} />
      )}
    </div>
  );
};

export default App;