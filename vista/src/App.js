import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import SellerDashboard from './components/SellerDashboard';
import PrivateRoute from './components/PrivateRoute';

// Componente para manejar 404 (Página no encontrada)
const NotFound = () => {
  return (
    <div className="text-center mt-5">
      <h1>404 - Página No Encontrada</h1>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <a href="/login" className="btn btn-primary">Volver al Login</a>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="container mt-3">
          <Routes>
            {/* Ruta para el login */}
            <Route path="/login" element={<Login />} />

            {/* Ruta protegida para administradores */}
            <Route
              path="/admin"
              element={<PrivateRoute roles={['admin']} component={AdminDashboard} />}
            />

            {/* Ruta protegida para vendedores */}
            <Route
              path="/seller"
              element={<PrivateRoute roles={['vendedor']} component={SellerDashboard} />}
            />

            {/* Ruta raíz: redirige al login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Ruta para manejar 404 (páginas no encontradas) */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;