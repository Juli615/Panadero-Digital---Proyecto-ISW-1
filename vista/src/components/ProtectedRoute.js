import React from 'react';
import { Navigate } from 'react-router-dom';
import { Toast } from 'react-bootstrap';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userInfoStr = localStorage.getItem('userInfo');
  const token = localStorage.getItem('token');
  
  if (!token || !userInfoStr) {
    // Mostrar notificación
    showNotification('Debe iniciar sesión para acceder a esta página');
    return <Navigate to="/login" replace />;
  }

  const userInfo = JSON.parse(userInfoStr);
  
  if (!allowedRoles.includes(userInfo.rol)) {
    // Mostrar notificación de acceso denegado
    showNotification(`No tiene permisos para acceder a esta sección. Redirigiendo a su área correspondiente.`);
    
    // Redirigir según rol
    switch (userInfo.rol) {
      case 'admin':
        return <Navigate to="/productos" replace />;
      case 'vendedor':
        return <Navigate to="/ventas" replace />;
      case 'proveedor':
        return <Navigate to="/pedidos-proveedor" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

// Función para mostrar notificaciones
const showNotification = (message) => {
  // Crear elemento de notificación
  const toastContainer = document.createElement('div');
  toastContainer.style.position = 'fixed';
  toastContainer.style.top = '20px';
  toastContainer.style.right = '20px';
  toastContainer.style.zIndex = '9999';
  
  const toast = document.createElement('div');
  toast.className = 'toast show';
  toast.style.backgroundColor = '#f8d7da';
  toast.style.color = '#721c24';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '4px';
  toast.style.boxShadow = '0 0.5rem 1rem rgba(0, 0, 0, 0.15)';
  toast.textContent = message;

  toastContainer.appendChild(toast);
  document.body.appendChild(toastContainer);

  // Remover después de 3 segundos
  setTimeout(() => {
    document.body.removeChild(toastContainer);
  }, 3000);
};

export default ProtectedRoute; 