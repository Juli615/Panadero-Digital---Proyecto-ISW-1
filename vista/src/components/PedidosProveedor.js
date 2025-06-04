import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Form,
  Alert,
  Container,
  Row,
  Col,
  InputGroup,
  ListGroup,
  Badge,
  Modal
} from 'react-bootstrap';
import { FaSearch, FaEdit } from 'react-icons/fa';

const PedidosProveedor = ({ usuarioId }) => {
  // Estados
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentPedido, setCurrentPedido] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Estados del pedido disponibles para el proveedor
  const estadosPedido = ['procesado', 'entregado'];

  // Cargar datos iniciales
  useEffect(() => {
    fetchPedidos();
  }, [usuarioId]);

  // Obtener pedidos específicos del proveedor
  const fetchPedidos = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/pedidos/proveedor/${usuarioId}`);
      if (!response.ok) throw new Error('Error al cargar los pedidos');
      const data = await response.json();
      setPedidos(data);

      // Obtener información de usuarios
      const uniqueUserIds = [...new Set(data.map(pedido => pedido.usuarioId))];
      await fetchUsuarios(uniqueUserIds);
    } catch (err) {
      setError(err.message);
    }
  };

  // Obtener información de usuarios
  const fetchUsuarios = async (userIds) => {
    try {
      const response = await fetch('http://localhost:8080/api/usuarios/list');
      if (!response.ok) throw new Error('Error al cargar los usuarios');
      const data = await response.json();
      
      // Crear un objeto con el ID del usuario como clave y su información como valor
      const usuariosMap = {};
      data.forEach(usuario => {
        if (userIds.includes(usuario.id)) {
          usuariosMap[usuario.id] = `${usuario.nombres} ${usuario.apellidos}`;
        }
      });
      
      setUsuarios(usuariosMap);
    } catch (err) {
      setError(err.message);
    }
  };

  // Obtener nombre del usuario
  const getNombreUsuario = (usuarioId) => {
    return usuarios[usuarioId] || 'Usuario Desconocido';
  };

  // Abrir modal para actualizar estado
  const handleUpdateStatus = (pedido) => {
    setCurrentPedido(pedido);
    setShowModal(true);
  };

  // Actualizar estado del pedido
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/pedidos/editar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentPedido)
      });

      if (!response.ok) throw new Error('Error al actualizar el pedido');
      
      setSuccess('Estado del pedido actualizado con éxito');
      setShowModal(false);
      fetchPedidos();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Obtener color del badge según estado
  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: 'warning',
      procesado: 'info',
      entregado: 'success',
      cancelado: 'danger'
    };
    return colores[estado] || 'secondary';
  };

  // Filtrar pedidos según término de búsqueda
  const filteredPedidos = pedidos.filter(pedido =>
    pedido.estadoPedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(pedido.fechaEntrega).toLocaleDateString().includes(searchTerm) ||
    getNombreUsuario(pedido.usuarioId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid>
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
      
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Buscar por estado, fecha o solicitante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID Pedido</th>
            <th>Solicitado por</th>
            <th>Estado</th>
            <th>Fecha Entrega</th>
            <th>Monto Total</th>
            <th style={{ width: '30%' }}>Insumos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredPedidos.map((pedido) => (
            <tr key={pedido.idPedido}>
              <td>{pedido.idPedido}</td>
              <td>
                <span className="fw-bold">{getNombreUsuario(pedido.usuarioId)}</span>
              </td>
              <td>
                <Badge bg={getEstadoColor(pedido.estadoPedido)}>
                  {pedido.estadoPedido.toUpperCase()}
                </Badge>
              </td>
              <td>{new Date(pedido.fechaEntrega).toLocaleDateString()}</td>
              <td>${Number(pedido.montoTotal).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td>
                <ListGroup variant="flush" style={{maxHeight: '100px', overflowY: 'auto', fontSize: '0.9em'}}>
                  {pedido.insumos.map((insumo, idx) => (
                    <ListGroup.Item key={idx} className="py-2 px-2 d-flex justify-content-between align-items-center">
                      <div>
                        <span className="fw-bold">{insumo.nombre}</span>
                        <br />
                        <small className="text-muted">
                          Cantidad: {Number(insumo.cantidadPedida).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </small>
                      </div>
                      <Badge bg="secondary">
                        ${Number(insumo.subtotal).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </td>
              <td>
                {pedido.estadoPedido !== 'entregado' && (
                  <Button 
                    variant="warning" 
                    size="sm" 
                    onClick={() => handleUpdateStatus(pedido)}
                  >
                    <FaEdit /> Actualizar Estado
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Estado del Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Estado del Pedido</Form.Label>
              <Form.Select
                value={currentPedido?.estadoPedido || ''}
                onChange={(e) => setCurrentPedido(prev => ({
                  ...prev,
                  estadoPedido: e.target.value
                }))}
                required
              >
                {estadosPedido.map(estado => (
                  <option key={estado} value={estado}>
                    {estado.toUpperCase()}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="text-end mt-3">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Actualizar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PedidosProveedor; 