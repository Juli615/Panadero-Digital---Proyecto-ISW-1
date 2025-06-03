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
  InputGroup
} from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaPlus } from 'react-icons/fa';

const InsumosCRUD = () => {
  // Estados
  const [insumos, setInsumos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentInsumo, setCurrentInsumo] = useState({
    nombre: '',
    cantidadDisponible: '',
    unidadMedida: '',
    cantidadMedida: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar insumos
  useEffect(() => {
    fetchInsumos();
  }, []);

  const fetchInsumos = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/insumos/list');
      if (!response.ok) throw new Error('Error al cargar los insumos');
      const data = await response.json();
      setInsumos(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentInsumo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Abrir modal para crear nuevo insumo
  const handleCreate = () => {
    setCurrentInsumo({
      nombre: '',
      cantidadDisponible: '',
      unidadMedida: '',
      cantidadMedida: ''
    });
    setIsEditing(false);
    setShowModal(true);
  };

  // Abrir modal para editar insumo
  const handleEdit = (insumo) => {
    setCurrentInsumo(insumo);
    setIsEditing(true);
    setShowModal(true);
  };

  // Guardar insumo (crear o editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? 'http://localhost:8080/api/insumos/editar'
        : 'http://localhost:8080/api/insumos/agregar';
      
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentInsumo)
      });

      if (!response.ok) throw new Error('Error al guardar el insumo');
      
      setSuccess(isEditing ? 'Insumo actualizado con éxito' : 'Insumo creado con éxito');
      setShowModal(false);
      fetchInsumos();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar insumo
  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este insumo?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/insumos/eliminar/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar el insumo');
        
        setSuccess('Insumo eliminado con éxito');
        fetchInsumos();
        
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Filtrar insumos según término de búsqueda
  const filteredInsumos = insumos.filter(insumo =>
    insumo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid>
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
      
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Buscar insumos..."
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
            <FaPlus /> Nuevo Insumo
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cantidad Disponible</th>
            <th>Unidad de Medida</th>
            <th>Cantidad Medida</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredInsumos.map((insumo) => (
            <tr key={insumo.idInsumo}>
              <td>{insumo.nombre}</td>
              <td>{insumo.cantidadDisponible}</td>
              <td>{insumo.unidadMedida}</td>
              <td>{insumo.cantidadMedida}</td>
              <td>
                <Button 
                  variant="warning" 
                  size="sm" 
                  className="me-2"
                  onClick={() => handleEdit(insumo)}
                >
                  <FaEdit /> Editar
                </Button>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDelete(insumo.idInsumo)}
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
          <Modal.Title>{isEditing ? 'Editar Insumo' : 'Nuevo Insumo'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={currentInsumo.nombre}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cantidad Disponible</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="cantidadDisponible"
                value={currentInsumo.cantidadDisponible}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Unidad de Medida</Form.Label>
              <Form.Control
                type="text"
                name="unidadMedida"
                value={currentInsumo.unidadMedida}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cantidad Medida</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="cantidadMedida"
                value={currentInsumo.cantidadMedida}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <div className="text-end">
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

export default InsumosCRUD; 