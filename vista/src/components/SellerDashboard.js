import React from 'react';
import { Link, Routes, Route, Navigate } from 'react-router-dom'; // Cambiar Switch por Routes, Redirect por Navigate
import InventoryView from './InventoryView';
import InvoiceCreation from './InvoiceCreation';

const SellerDashboard = () => {
  return (
    <div className="d-flex">
      <div className="bg-dark text-white p-3" style={{ width: '250px', minHeight: '100vh' }}>
        <h2 className="text-light mb-4">Vendedor Dashboard</h2>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link text-white" to="/seller/inventario">Inventario</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/seller/facturas">Crear Factura</Link>
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
          <Route path="inventario" element={<InventoryView />} />
          <Route path="facturas" element={<InvoiceCreation />} />
          <Route path="" element={<Navigate to="inventario" />} />
        </Routes>
      </div>
    </div>
  );
};

export default SellerDashboard;