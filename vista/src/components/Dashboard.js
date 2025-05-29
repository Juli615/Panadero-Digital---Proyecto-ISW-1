import React from 'react';
import Inventario from './Inventario';
import CrearPedido from './Pedidos';
// Componente de Dashboard
const Dashboard = ({ token, user, onLogout }) => {
  return (
    <div>
      <div className="dashboard-header">
        <h2>Bienvenido, {user.role}</h2>
        <button onClick={onLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>
      <div className="dashboard-grid">
        <Inventario token={token} />
        <CrearPedido token={token} />
      </div>
    </div>
  );
};

export default Dashboard;
