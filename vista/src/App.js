import React, { useState } from 'react';
import Login from './components/Login';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userData, setUserData] = useState(null);

  const handleLogout = () => {
    setToken('');
    setUserData(null);
    localStorage.removeItem('token');
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Panadero Digital</h1>
      {token && userData ? (
        <div className="text-center">
          <h2>¡Bienvenido!</h2>
          <p>Has iniciado sesión con el correo: {userData.correo}</p>
          <p>Nombre: {userData.nombres} {userData.apellidos}</p>
          <button 
            className="btn btn-danger mt-3"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        </div>
      ) : (
        <Login setToken={setToken} setUserData={setUserData} />
      )}
    </div>
  );
};

export default App;