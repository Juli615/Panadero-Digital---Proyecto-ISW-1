import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    numeroDocumento: '',
    correoElectronico: '',
    password: '',
    confirmPassword: '',
    celular: '',
    rol: 'vendedor'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.nombres || !formData.apellidos || !formData.numeroDocumento || 
        !formData.correoElectronico || !formData.password || !formData.celular) {
      setError('Todos los campos son obligatorios');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    if (!formData.correoElectronico.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Por favor ingrese un correo electrónico válido');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    try {
      const userData = {
        ...formData,
        password: formData.password
      };
      delete userData.confirmPassword;

      const response = await fetch('http://localhost:8080/api/usuarios/agregar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar el usuario');
      }

      setSuccess('Registro exitoso. Redirigiendo al login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al registrar el usuario');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-center mb-4">Registro de Usuario</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombres</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombres"
                      value={formData.nombres}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Apellidos</Form.Label>
                    <Form.Control
                      type="text"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Número de Documento</Form.Label>
                <Form.Control
                  type="text"
                  name="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="correoElectronico"
                  value={formData.correoElectronico}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirmar Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Celular</Form.Label>
                <Form.Control
                  type="tel"
                  name="celular"
                  value={formData.celular}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Rol</Form.Label>
                <Form.Select
                  name="rol"
                  value={formData.rol}
                  onChange={handleInputChange}
                  required
                >
                  <option value="vendedor">Vendedor</option>
                  <option value="proveedor">Proveedor</option>
                </Form.Select>
              </Form.Group>

              <div className="d-grid gap-2">
                <Button variant="primary" type="submit">
                  Registrarse
                </Button>
                <Button variant="outline-secondary" onClick={() => navigate('/login')}>
                  Volver al Login
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Registro; 