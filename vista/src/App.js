import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { FaUser, FaBox, FaShoppingCart, FaUsers, FaClipboardList, FaCog, FaSignOutAlt, FaTruck } from 'react-icons/fa';
import Login from './components/Login';
import Registro from './components/Registro';
import InsumosCRUD from './components/InsumosCRUD';
import ProductosCRUD from './components/ProductosCRUD';
import PedidosCRUD from './components/PedidosCRUD';
import PedidosProveedor from './components/PedidosProveedor';
import UsuariosCRUD from './components/UsuariosCRUD';
import VentasCRUD from './components/VentasCRUD';
import ProtectedRoute from './components/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavItem = ({ to, icon: Icon, children, disabled }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Nav.Link 
      as={Link} 
      to={to}
      className={`d-flex align-items-center gap-2 px-3 py-2 ${isActive ? 'active nav-link-active' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={disabled ? (e) => e.preventDefault() : undefined}
      style={disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
    >
      <Icon />
      {children}
    </Nav.Link>
  );
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userData, setUserData] = useState(() => {
    const savedUserInfo = localStorage.getItem('userInfo');
    return savedUserInfo ? JSON.parse(savedUserInfo) : null;
  });

  useEffect(() => {
    // Verificar si hay información de usuario en localStorage al cargar
    const savedUserInfo = localStorage.getItem('userInfo');
    if (savedUserInfo && !userData) {
      setUserData(JSON.parse(savedUserInfo));
    }
  }, []);

  const handleLogout = () => {
    setToken('');
    setUserData(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  };

  // Función para determinar si mostrar un ítem del menú según el rol
  const canShowMenuItem = (requiredRoles) => {
    if (!userData || !userData.rol) return false;
    return requiredRoles.includes(userData.rol);
  };

  // Función para determinar si permitir acceso a una ruta
  const canAccessRoute = (requiredRoles) => {
    if (!userData || !userData.rol) return false;
    return requiredRoles.includes(userData.rol);
  };

  // Función para obtener la ruta por defecto según el rol
  const getDefaultRoute = () => {
    if (!userData) return '/login';
    switch (userData.rol) {
      case 'admin':
        return '/productos';
      case 'vendedor':
        return '/ventas';
      case 'proveedor':
        return '/pedidos-proveedor';
      default:
        return '/login';
    }
  };

  return (
    <BrowserRouter>
      <div className="min-vh-100 bg-light">
        {userData ? (
          <>
            <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm">
              <Container fluid>
                <Navbar.Brand className="d-flex align-items-center gap-2">
                  <FaCog className="spin-hover" />
                  Panadero Digital
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto">
                    {/* Solo admin puede ver insumos */}
                    {canShowMenuItem(['admin']) && (
                      <NavItem to="/insumos" icon={FaBox}>Insumos</NavItem>
                    )}
                    
                    {/* Solo admin puede ver productos */}
                    {canShowMenuItem(['admin']) && (
                      <NavItem to="/productos" icon={FaShoppingCart}>Productos</NavItem>
                    )}
                    
                    {/* Solo admin puede ver todos los pedidos */}
                    {canShowMenuItem(['admin']) && (
                      <NavItem to="/pedidos" icon={FaClipboardList}>Pedidos</NavItem>
                    )}
                    
                    {/* Solo proveedor puede ver sus pedidos */}
                    {canShowMenuItem(['proveedor']) && (
                      <NavItem to="/pedidos-proveedor" icon={FaTruck}>Pedidos Proveedor</NavItem>
                    )}
                    
                    {/* Solo admin puede ver usuarios */}
                    {canShowMenuItem(['admin']) && (
                      <NavItem to="/usuarios" icon={FaUsers}>Usuarios</NavItem>
                    )}
                    
                    {/* Admin y vendedor pueden ver ventas */}
                    {canShowMenuItem(['admin', 'vendedor']) && (
                      <NavItem to="/ventas" icon={FaShoppingCart}>Ventas</NavItem>
                    )}
                  </Nav>
                  <Dropdown align="end">
                    <Dropdown.Toggle variant="outline-light" id="user-dropdown" className="d-flex align-items-center gap-2">
                      <FaUser />
                      <span className="d-none d-md-inline">
                        {userData.nombres} {userData.apellidos}
                      </span>
                      <span className="badge bg-primary ms-2">{userData.rol}</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item disabled>
                        <small className="text-muted">Conectado como:</small>
                        <br />
                        {userData.nombres} {userData.apellidos}
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout} className="text-danger">
                        <FaSignOutAlt className="me-2" />
                        Cerrar Sesión
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Navbar.Collapse>
              </Container>
            </Navbar>

            <Container fluid className="px-4">
              <Routes>
                {/* Rutas protegidas por rol */}
                <Route 
                  path="/insumos" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <InsumosCRUD />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path="/productos" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ProductosCRUD />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path="/pedidos" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <PedidosCRUD usuarioId={userData?.id} />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path="/pedidos-proveedor" 
                  element={
                    <ProtectedRoute allowedRoles={['proveedor']}>
                      <PedidosProveedor usuarioId={userData?.id} />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path="/usuarios" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <UsuariosCRUD />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path="/ventas" 
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'vendedor']}>
                      <VentasCRUD usuarioId={userData?.id} />
                    </ProtectedRoute>
                  }
                />
                
                {/* Ruta por defecto según rol */}
                <Route 
                  path="/" 
                  element={<Navigate to={getDefaultRoute()} replace />}
                />
              </Routes>
            </Container>
          </>
        ) : (
          <Container className="py-5">
            <Routes>
              <Route path="/registro" element={<Registro />} />
              <Route path="/login" element={<Login setToken={setToken} setUserData={setUserData} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Container>
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;