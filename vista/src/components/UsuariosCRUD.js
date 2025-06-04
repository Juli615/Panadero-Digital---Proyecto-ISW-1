import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Form,
  Modal,
  Alert,
  Container,
  Row,
  Col,
  InputGroup,
  Badge
} from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaUser } from 'react-icons/fa';

const UsuariosCRUD = () => {
  // Estados
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState({
    nombres: '',
    apellidos: '',
    correoElectronico: '',
    celular: '',
    rol: 'vendedor',
    password: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Roles disponibles
  const rolesDisponibles = ['admin', 'vendedor', 'proveedor'];
  const estadosDisponibles = ['activo', 'inactivo'];

  // Cargar datos iniciales
  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Obtener usuarios
  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/usuarios/list');
      if (!response.ok) throw new Error('Error al cargar los usuarios');
      const data = await response.json();
      setUsuarios(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUsuario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Abrir modal para crear nuevo usuario
  const handleCreate = () => {
    setCurrentUsuario({
      nombres: '',
      apellidos: '',
      correoElectronico: '',
      celular: '',
      rol: 'vendedor',
      password: ''
    });
    setIsEditing(false);
    setShowModal(true);
  };

  // Abrir modal para editar usuario
  const handleEdit = (usuario) => {
    setCurrentUsuario({
      ...usuario,
      password: '' // No mostramos la contraseña actual por seguridad
    });
    setIsEditing(true);
    setShowModal(true);
  };

  // Validar email
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  // Guardar usuario (crear o editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validaciones
      if (!validateEmail(currentUsuario.correoElectronico)) {
        setError('Por favor ingrese un email válido');
        return;
      }

      if (!isEditing && !currentUsuario.password) {
        setError('La contraseña es requerida para nuevos usuarios');
        return;
      }

      const url = isEditing 
        ? 'http://localhost:8080/api/usuarios/editar'
        : 'http://localhost:8080/api/usuarios/agregar';

      // Crear una copia del usuario actual para enviar
      const usuarioToSend = { ...currentUsuario };

      // Si estamos editando y la contraseña está vacía, la eliminamos del objeto
      if (isEditing && (!usuarioToSend.password || usuarioToSend.password.trim() === '')) {
        delete usuarioToSend.password;
      }

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar el usuario');
      }
      
      setSuccess(isEditing ? 'Usuario actualizado con éxito' : 'Usuario creado con éxito');
      setShowModal(false);
      fetchUsuarios();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/usuarios/eliminar/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar el usuario');
        
        setSuccess('Usuario eliminado con éxito');
        fetchUsuarios();
        
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Obtener color del badge según rol
  const getRolColor = (rol) => {
    const colores = {
      admin: 'danger',
      vendedor: 'primary',
      proveedor: 'success'
    };
    return colores[rol] || 'secondary';
  };

  // Filtrar usuarios según término de búsqueda
  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.correoElectronico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.rol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid>
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
      
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Buscar por nombre, email o rol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
          </InputGroup>
        </Col>
        <Col md={6} className="text-end">
          <Button variant="primary" onClick={handleCreate}>
            <FaPlus /> Nuevo Usuario
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nombres || ''}</td>
              <td>{usuario.apellidos || ''}</td>
              <td>{usuario.correoElectronico || ''}</td>
              <td>{usuario.celular || ''}</td>
              <td>
                <Badge bg={getRolColor(usuario.rol)}>
                  {(usuario.rol || '').toUpperCase()}
                </Badge>
              </td>
              <td>
                <Button 
                  variant="warning" 
                  size="sm" 
                  className="me-2"
                  onClick={() => handleEdit(usuario)}
                >
                  <FaEdit /> Editar
                </Button>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDelete(usuario.id)}
                >
                  <FaTrash /> Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaUser className="me-2" />
            {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombres</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombres"
                    value={currentUsuario.nombres}
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
                    value={currentUsuario.apellidos}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="correoElectronico"
                value={currentUsuario.correoElectronico}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="tel"
                name="celular"
                value={currentUsuario.celular}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rol</Form.Label>
                  <Form.Select
                    name="rol"
                    value={currentUsuario.rol}
                    onChange={handleInputChange}
                    required
                  >
                    {rolesDisponibles.map(rol => (
                      <option key={rol} value={rol}>
                        {(rol || '').toUpperCase()}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>
                {isEditing ? 'Nueva Contraseña (dejar en blanco para mantener la actual)' : 'Contraseña'}
                {!isEditing && <span className="text-danger">*</span>}
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={currentUsuario.password}
                onChange={handleInputChange}
                required={!isEditing}
                placeholder={isEditing ? 'Dejar en blanco para mantener la contraseña actual' : 'Ingrese la contraseña'}
              />
              {isEditing && (
                <Form.Text className="text-muted">
                  Si no desea cambiar la contraseña, deje este campo en blanco.
                </Form.Text>
              )}
            </Form.Group>

            <div className="text-end mt-3">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {isEditing ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UsuariosCRUD; 