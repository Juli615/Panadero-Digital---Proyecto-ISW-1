import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import InsumosCRUD from './components/InsumosCRUD';
import ProductosCRUD from './components/ProductosCRUD';
import PedidosCRUD from './components/PedidosCRUD';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userData, setUserData] = useState(null);

  const handleLogout = () => {
    setToken('');
    setUserData(null);
    localStorage.removeItem('token');
  };

  return (
    <BrowserRouter>
      <div className="container">
        <h1 className="text-center my-4">Panadero Digital</h1>
        
        {userData && (
          <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
            <div className="container-fluid">
              <div className="navbar-nav">
                <Link to="/insumos" className="nav-link">Gestión de Insumos</Link>
                <Link to="/productos" className="nav-link">Gestión de Productos</Link>
                <Link to="/pedidos" className="nav-link">Gestión de Pedidos</Link>
                {/* Aquí irán los otros enlaces de CRUD */}
              </div>
              <div className="d-flex align-items-center">
                <span className="me-3">
                  {userData.nombres} {userData.apellidos} ({userData.rol})
                </span>
                <button 
                  className="btn btn-danger"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </nav>
        )}

        <Routes>
          <Route path="/login" element={<Login setToken={setToken} setUserData={setUserData} />} />
          <Route path="/insumos" element={<InsumosCRUD />} />
          <Route path="/productos" element={<ProductosCRUD />} />
          <Route path="/pedidos" element={<PedidosCRUD />} />
          <Route path="/" element={<InsumosCRUD />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;