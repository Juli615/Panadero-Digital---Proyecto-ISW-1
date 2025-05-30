import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  const { auth } = useContext(AuthContext);
  const token = auth.token;

  let userRole = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.rol ? decodedToken.rol.toLowerCase() : null; // Cambiar a 'rol' como en el token
    } catch (err) {
      console.error('Error decodificando token:', err);
    }
  }

  // Si hay token, usuario y el rol está permitido, renderiza el componente
  return token && userRole && roles.includes(userRole) ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;