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
  ListGroup,
  Badge
} from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaCalendar } from 'react-icons/fa';

const PedidosCRUD = ({ usuarioId }) => {
  // Estados
  const [pedidos, setPedidos] = useState([]);
  const [insumos, setInsumos] = useState([]); // Para seleccionar insumos
  const [proveedores, setProveedores] = useState([]); // Para seleccionar proveedores
  const [showModal, setShowModal] = useState(false);
  const [currentPedido, setCurrentPedido] = useState({
    usuarioId: usuarioId,
    proveedorId: '',
    nombreProveedor: '',
    estadoPedido: 'pendiente',
    fechaEntrega: new Date().toISOString().split('T')[0],
    insumos: [],
    montoTotal: 0
  });
  const [currentInsumo, setCurrentInsumo] = useState({
    insumoId: '',
    nombre: '',
    cantidadPedida: '0.00',
    subtotal: '0.00'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Estados del pedido disponibles
  const estadosPedido = ['pendiente', 'procesado', 'entregado', 'cancelado'];

  // Cargar datos iniciales
  useEffect(() => {
    fetchPedidos();
    fetchInsumos();
    fetchProveedores();
  }, []);

  // Obtener pedidos
  const fetchPedidos = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/pedidos/list');
      if (!response.ok) throw new Error('Error al cargar los pedidos');
      const data = await response.json();
      setPedidos(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Obtener insumos disponibles
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

  // Obtener proveedores
  const fetchProveedores = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/usuarios/list');
      if (!response.ok) throw new Error('Error al cargar los usuarios');
      const data = await response.json();
      // Filtrar solo los usuarios que son proveedores
      const proveedoresFiltrados = data.filter(usuario => usuario.rol === 'proveedor');
      setProveedores(proveedoresFiltrados);
    } catch (err) {
      setError(err.message);
    }
  };

  // Manejar cambios en el formulario principal
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'montoTotal') {
      setCurrentPedido(prev => ({
        ...prev,
        [name]: value === '' ? 0 : Number(value)
      }));
      return;
    }

    setCurrentPedido(prev => ({
      ...prev,
      [name]: value
    }));

    // Si se selecciona un proveedor, actualizar también su nombre
    if (name === 'proveedorId') {
      const proveedor = proveedores.find(p => p.id === value);
      if (proveedor) {
        setCurrentPedido(prev => ({
          ...prev,
          proveedorId: value,
          nombreProveedor: `${proveedor.nombres} ${proveedor.apellidos}`
        }));
      }
    }
  };

  // Manejar cambios en el formulario de insumos
  const handleInsumoChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === 'cantidadPedida') {
      finalValue = value.replace(/[^0-9.]/g, '');
      if (finalValue.split('.').length > 2) return;
    }

    setCurrentInsumo(prev => ({
      ...prev,
      [name]: finalValue
    }));

    // Si se selecciona un insumo, actualizar su nombre
    if (name === 'insumoId') {
      const insumo = insumos.find(i => i.idInsumo === value);
      if (insumo) {
        setCurrentInsumo(prev => ({
          ...prev,
          insumoId: value,
          nombre: insumo.nombre
        }));
      }
    }
  };

  // Calcular subtotal del insumo
  const calcularSubtotal = (cantidad, insumoId) => {
    const insumo = insumos.find(i => i.idInsumo === insumoId);
    if (!insumo) return 0;
    return (parseFloat(cantidad) * parseFloat(insumo.precio || 0)).toFixed(2);
  };

  // Agregar insumo a la lista del pedido
  const handleAddInsumo = () => {
    if (!currentInsumo.insumoId || !currentInsumo.cantidadPedida) {
      setError('Por favor seleccione un insumo y especifique la cantidad');
      return;
    }
    
    setCurrentPedido(prev => ({
      ...prev,
      insumos: [...prev.insumos, currentInsumo]
    }));

    setCurrentInsumo({
      insumoId: '',
      nombre: '',
      cantidadPedida: '0.00',
      subtotal: '0.00'
    });
  };

  // Remover insumo de la lista del pedido
  const handleRemoveInsumo = (insumoId) => {
    setCurrentPedido(prev => ({
      ...prev,
      insumos: prev.insumos.filter(i => i.insumoId !== insumoId)
    }));
  };

  // Abrir modal para crear nuevo pedido
  const handleCreate = () => {
    setCurrentPedido({
      usuarioId: usuarioId,
      proveedorId: '',
      nombreProveedor: '',
      estadoPedido: 'pendiente',
      fechaEntrega: new Date().toISOString().split('T')[0],
      insumos: [],
      montoTotal: 0
    });
    setIsEditing(false);
    setShowModal(true);
  };

  // Abrir modal para editar pedido
  const handleEdit = (pedido) => {
    setCurrentPedido({
      ...pedido,
      fechaEntrega: new Date(pedido.fechaEntrega).toISOString().split('T')[0],
      montoTotal: Number(pedido.montoTotal)
    });
    setIsEditing(true);
    setShowModal(true);
  };

  // Guardar pedido (crear o editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentPedido.insumos.length === 0) {
        setError('Debe agregar al menos un insumo al pedido');
        return;
      }

      const url = isEditing 
        ? 'http://localhost:8080/api/pedidos/editar'
        : 'http://localhost:8080/api/pedidos/agregar';
      
      const pedidoToSend = {
        ...currentPedido,
        insumos: currentPedido.insumos.map(insumo => ({
          ...insumo,
          cantidadPedida: parseFloat(insumo.cantidadPedida)
        }))
      };

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedidoToSend)
      });

      if (!response.ok) throw new Error('Error al guardar el pedido');
      
      setSuccess(isEditing ? 'Pedido actualizado con éxito' : 'Pedido creado con éxito');
      setShowModal(false);
      fetchPedidos();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar pedido
  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este pedido?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/pedidos/eliminar/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar el pedido');
        
        setSuccess('Pedido eliminado con éxito');
        fetchPedidos();
        
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message);
      }
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
    pedido.nombreProveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.estadoPedido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid>
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
      
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Buscar por proveedor o estado..."
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
            <FaPlus /> Nuevo Pedido
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Proveedor</th>
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
              <td>{pedido.nombreProveedor}</td>
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
                <Button 
                  variant="warning" 
                  size="sm" 
                  className="me-2"
                  onClick={() => handleEdit(pedido)}
                >
                  <FaEdit /> Editar
                </Button>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDelete(pedido.idPedido)}
                >
                  <FaTrash /> Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Editar Pedido' : 'Nuevo Pedido'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Proveedor</Form.Label>
                  <Form.Select
                    name="proveedorId"
                    value={currentPedido.proveedorId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione un proveedor</option>
                    {proveedores.map(proveedor => (
                      <option key={proveedor.id} value={proveedor.id}>
                        {proveedor.nombres} {proveedor.apellidos}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Estado del Pedido</Form.Label>
                  <Form.Select
                    name="estadoPedido"
                    value={currentPedido.estadoPedido}
                    onChange={handleInputChange}
                    required
                  >
                    {estadosPedido.map(estado => (
                      <option key={estado} value={estado}>
                        {estado.toUpperCase()}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Entrega</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="date"
                      name="fechaEntrega"
                      value={currentPedido.fechaEntrega}
                      onChange={handleInputChange}
                      required
                    />
                    <InputGroup.Text>
                      <FaCalendar />
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Monto Total</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="montoTotal"
                      value={currentPedido.montoTotal}
                      onChange={handleInputChange}
                      pattern="^\d*\.?\d{0,2}$"
                      title="Ingrese un monto válido (máximo 2 decimales)"
                      placeholder="0.00"
                      required
                    />
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Ingrese el monto con máximo 2 decimales (ejemplo: 1234.56)
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <h5>Insumos del Pedido</h5>
                <div className="mb-3">
                  <Form.Group className="mb-2">
                    <Form.Label>Seleccionar Insumo</Form.Label>
                    <Form.Select
                      name="insumoId"
                      value={currentInsumo.insumoId}
                      onChange={handleInsumoChange}
                    >
                      <option value="">Seleccione un insumo</option>
                      {insumos.map(insumo => (
                        <option key={insumo.idInsumo} value={insumo.idInsumo}>
                          {insumo.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Cantidad</Form.Label>
                    <Form.Control
                      type="text"
                      name="cantidadPedida"
                      value={currentInsumo.cantidadPedida}
                      onChange={handleInsumoChange}
                      pattern="^\d*\.?\d{0,2}$"
                      title="Ingrese una cantidad válida (máximo 2 decimales)"
                    />
                  </Form.Group>

                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={handleAddInsumo}
                    className="w-100"
                  >
                    <FaPlus /> Agregar Insumo
                  </Button>
                </div>

                <div className="border rounded p-2" style={{maxHeight: '200px', overflowY: 'auto'}}>
                  <h6 className="mb-3">Insumos agregados:</h6>
                  <ListGroup variant="flush">
                    {currentPedido.insumos.map((insumo, idx) => (
                      <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center py-2">
                        <div>
                          <span className="fw-bold">{insumo.nombre}</span>
                          <br />
                          <small className="text-muted">
                            Cantidad: {Number(insumo.cantidadPedida).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </small>
                        </div>
                        <div className="text-end">
                          <div className="mb-1">
                            <Badge bg="secondary">
                              ${Number(insumo.subtotal).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Badge>
                          </div>
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleRemoveInsumo(insumo.insumoId)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              </Col>
            </Row>

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

export default PedidosCRUD; 