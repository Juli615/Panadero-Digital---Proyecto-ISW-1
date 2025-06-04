import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { FaUser, FaBox, FaShoppingCart, FaUsers, FaClipboardList, FaCog, FaSignOutAlt } from 'react-icons/fa';
import Login from './components/Login';
import InsumosCRUD from './components/InsumosCRUD';
import ProductosCRUD from './components/ProductosCRUD';
import PedidosCRUD from './components/PedidosCRUD';
import UsuariosCRUD from './components/UsuariosCRUD';
import VentasCRUD from './components/VentasCRUD';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavItem = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Nav.Link 
      as={Link} 
      to={to}
      className={`d-flex align-items-center gap-2 px-3 py-2 ${isActive ? 'active nav-link-active' : ''}`}
    >
      <Icon />
      {children}
    </Nav.Link>
  );
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userData, setUserData] = useState(null);

  const handleLogout = () => {
    setToken('');
    setUserData(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
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
                    <NavItem to="/insumos" icon={FaBox}>Insumos</NavItem>
                    <NavItem to="/productos" icon={FaShoppingCart}>Productos</NavItem>
                    <NavItem to="/pedidos" icon={FaClipboardList}>Pedidos</NavItem>
                    <NavItem to="/usuarios" icon={FaUsers}>Usuarios</NavItem>
                    <NavItem to="/ventas" icon={FaShoppingCart}>Ventas</NavItem>
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
                <Route path="/insumos" element={<InsumosCRUD />} />
                <Route path="/productos" element={<ProductosCRUD />} />
                <Route path="/pedidos" element={<PedidosCRUD />} />
                <Route path="/usuarios" element={<UsuariosCRUD />} />
                <Route path="/ventas" element={<VentasCRUD />} />
              </Routes>
            </Container>
          </>
        ) : (
          <Container className="py-5">
            <Routes>
              <Route path="*" element={<Login setToken={setToken} setUserData={setUserData} />} />
            </Routes>
          </Container>
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;