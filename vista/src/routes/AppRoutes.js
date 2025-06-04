import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProductosCRUD from '../components/ProductosCRUD';
import PedidosCRUD from '../components/PedidosCRUD';
import PedidosProveedor from '../components/PedidosProveedor';

const AppRoutes = ({ usuario }) => {
  // Si no hay usuario autenticado, redirigir al login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Si es proveedor, redirigir a la vista de pedidos de proveedor
  if (usuario.rol === 'proveedor') {
    return (
      <Routes>
        <Route path="/pedidos-proveedor" element={<PedidosProveedor usuarioId={usuario.id} />} />
        <Route path="*" element={<Navigate to="/pedidos-proveedor" replace />} />
      </Routes>
    );
  }

  // Si es admin, mostrar las rutas normales
  return (
    <Routes>
      <Route path="/productos" element={<ProductosCRUD />} />
      <Route path="/pedidos" element={<PedidosCRUD />} />
      {/* Ruta por defecto */}
      <Route path="/" element={<ProductosCRUD />} />
    </Routes>
  );
};

export default AppRoutes; 