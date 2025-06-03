import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductosCRUD from '../components/ProductosCRUD';
import PedidosCRUD from '../components/PedidosCRUD';

const AppRoutes = () => {
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