import React from 'react';
import { Link, Routes, Route, Navigate } from 'react-router-dom'; // Cambiar Switch por Routes, Redirect por Navigate
import InsumosList from './InsumosList';
import InsumoForm from './InsumoForm';
import ProductsList from './ProductsList';
import ProductForm from './ProductForm';
import InventoryView from './InventoryView';

const AdminDashboard = () => {
  return (
    <div className="d-flex">
      <div className="bg-dark text-white p-3" style={{ width: '250px', minHeight: '100vh' }}>
        <h2 className="text-light mb-4">Admin Dashboard</h2>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin/insumos">Insumos</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin/productos">Productos</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin/inventario">Inventario</Link>
          </li>
          <li className="nav-item">
            <button
              className="nav-link text-white btn btn-link p-0"
              onClick={() => localStorage.removeItem('token')}
            >
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </div>
      <div className="flex-grow-1 p-4">
        <Routes>
          <Route path="insumos" element={<InsumosList />} />
          <Route path="insumo/:id?" element={<InsumoForm />} />
          <Route path="productos" element={<ProductsList />} />
          <Route path="producto/:id?" element={<ProductForm />} />
          <Route path="inventario" element={<InventoryView />} />
          <Route path="" element={<Navigate to="insumos" />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;