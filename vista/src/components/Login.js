import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const Login = ({ setToken, setUserData }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const credentials = {
        correo: username,
        password: password
      };

      const data = await api.login(credentials);
      console.log('Login exitoso:', data);

      if (data && data.token) {
        // Guardar el token en ambos storages
        localStorage.setItem('token', data.token);
        sessionStorage.setItem('token', data.token);
        setToken(data.token);

        // Guardar la información del usuario en ambos storages
        const userInfo = {
          id: data.id,
          correo: data.correo,
          nombres: data.nombres,
          apellidos: data.apellidos,
          rol: data.rol
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        setUserData(userInfo);

        // Redirigir según el rol
        switch (data.rol) {
          case 'admin':
            navigate('/productos');
            break;
          case 'vendedor':
            navigate('/ventas');
            break;
          case 'proveedor':
            navigate('/pedidos-proveedor');
            break;
          default:
            navigate('/');
        }
      } else {
        throw new Error('No se recibió el token en la respuesta');
      }
    } catch (err) {
      console.error('Error durante el login:', err);
      setError(err.message || 'Error al intentar iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const fillTestCredentials = () => {
    setUsername('juan.perez@gmail.com');
    setPassword('password123');
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-center mb-4">Iniciar Sesión</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingrese su correo electrónico"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                  required
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
                <Button 
                  variant="outline-primary" 
                  onClick={() => navigate('/registro')}
                >
                  Registrarse
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;