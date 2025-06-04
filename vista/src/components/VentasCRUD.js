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
import { FaEdit, FaTrash, FaSearch, FaPlus, FaShoppingCart, FaCalculator, FaReceipt } from 'react-icons/fa';
import TicketVenta from './TicketVenta';

const VentasCRUD = () => {
  // Estados
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]); // Lista de productos disponibles
  const [showModal, setShowModal] = useState(false);
  const [currentVenta, setCurrentVenta] = useState({
    usuarioId: '',
    nombresVendedor: '',
    fechaVenta: new Date().toISOString(),
    productos: [],
    montoTotal: 0
  });
  const [currentProducto, setCurrentProducto] = useState({
    productoId: '',
    nombre: '',
    precioUnitario: 0,
    cantidad: 1,
    subtotal: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTicket, setShowTicket] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState(null);

  // Estados de venta disponibles
  const estadosVenta = ['completada', 'cancelada'];

  // Obtener información del vendedor del localStorage
  const getUserInfo = () => {
    const userInfoStr = localStorage.getItem('userInfo');
    if (!userInfoStr) {
      setError('No se encontró información del vendedor. Por favor, inicie sesión nuevamente.');
      return null;
    }
    return JSON.parse(userInfoStr);
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchVentas();
    fetchProductos();
  }, []);

  // Obtener ventas
  const fetchVentas = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/ventas/list');
      if (!response.ok) throw new Error('Error al cargar las ventas');
      const data = await response.json();
      setVentas(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Obtener productos disponibles
  const fetchProductos = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/productos/list');
      if (!response.ok) throw new Error('Error al cargar los productos');
      const data = await response.json();
      setProductos(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Manejar cambios en el formulario principal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentVenta(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambios en el formulario de productos
  const handleProductoChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'productoId') {
      const productoSeleccionado = productos.find(p => p.idProducto === value);
      if (productoSeleccionado) {
        setCurrentProducto(prev => ({
          ...prev,
          productoId: value,
          nombre: productoSeleccionado.nombre,
          precioUnitario: parseFloat(productoSeleccionado.precio),
          subtotal: parseFloat(productoSeleccionado.precio) * prev.cantidad
        }));
      } else {
        setCurrentProducto({
          productoId: '',
          nombre: '',
          precioUnitario: 0,
          cantidad: 1,
          subtotal: 0
        });
      }
    } else if (name === 'cantidad') {
      const cantidad = parseInt(value) || 0;
      setCurrentProducto(prev => ({
        ...prev,
        cantidad,
        subtotal: prev.precioUnitario * cantidad
      }));
    }
  };

  // Agregar producto a la venta
  const handleAddProducto = () => {
    // Validar que haya un producto seleccionado
    if (!currentProducto.productoId || currentProducto.productoId === '') {
      setError('Por favor seleccione un producto');
      return;
    }

    // Validar que la cantidad sea válida
    if (!currentProducto.cantidad || currentProducto.cantidad <= 0) {
      setError('Por favor ingrese una cantidad válida');
      return;
    }

    // Si pasa las validaciones, agregar el producto
    setCurrentVenta(prev => {
      const nuevosProductos = [...prev.productos, {
        productoId: currentProducto.productoId,
        nombre: currentProducto.nombre,
        precioUnitario: currentProducto.precioUnitario,
        cantidad: currentProducto.cantidad,
        subtotal: currentProducto.subtotal
      }];
      
      return {
        ...prev,
        productos: nuevosProductos,
        montoTotal: nuevosProductos.reduce((total, prod) => total + prod.subtotal, 0)
      };
    });

    // Limpiar el mensaje de error si existe
    setError('');
    
    // Resetear el formulario de producto
    setCurrentProducto({
      productoId: '',
      nombre: '',
      precioUnitario: 0,
      cantidad: 1,
      subtotal: 0
    });
  };

  // Remover producto de la venta
  const handleRemoveProducto = (productoId) => {
    setCurrentVenta(prev => {
      const nuevosProductos = prev.productos.filter(p => p.productoId !== productoId);
      const nuevoMontoTotal = nuevosProductos.reduce((total, prod) => total + prod.subtotal, 0);
      
      return {
        ...prev,
        productos: nuevosProductos,
        montoTotal: nuevoMontoTotal
      };
    });
  };

  // Abrir modal para crear nueva venta
  const handleCreate = () => {
    const userInfo = getUserInfo();
    if (!userInfo) return;

    setCurrentVenta({
      usuarioId: userInfo.id,
      nombresVendedor: `${userInfo.nombres} ${userInfo.apellidos}`,
      fechaVenta: new Date().toISOString(),
      productos: [],
      montoTotal: 0
    });
    setIsEditing(false);
    setShowModal(true);
  };

  // Abrir modal para editar venta
  const handleEdit = (venta) => {
    setCurrentVenta({
      ...venta,
      fechaVenta: new Date(venta.fechaVenta).toISOString()
    });
    setIsEditing(true);
    setShowModal(true);
  };

  // Guardar venta (crear o editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userInfo = getUserInfo();
      if (!userInfo) return;

      if (currentVenta.productos.length === 0) {
        setError('Debe agregar al menos un producto a la venta');
        return;
      }

      const ventaToSend = {
        ...currentVenta,
        usuarioId: userInfo.id,
        nombresVendedor: `${userInfo.nombres} ${userInfo.apellidos}`
      };

      const url = isEditing 
        ? 'http://localhost:8080/api/ventas/editar'
        : 'http://localhost:8080/api/ventas/agregar';

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ventaToSend)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar la venta');
      }
      
      setSuccess(isEditing ? 'Venta actualizada con éxito' : 'Venta registrada con éxito');
      setShowModal(false);
      fetchVentas();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      // No cerramos el modal si hay error para que el usuario pueda corregir
    }
  };

  // Eliminar venta
  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta venta?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/ventas/eliminar/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar la venta');
        
        setSuccess('Venta eliminada con éxito');
        fetchVentas();
        
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Filtrar ventas según término de búsqueda y ordenar por fecha
  const filteredVentas = ventas
    .filter(venta =>
      venta.fechaVenta ? venta.fechaVenta.toString().includes(searchTerm) : false
    )
    .sort((a, b) => new Date(b.fechaVenta) - new Date(a.fechaVenta));

  // Mostrar ticket de venta
  const handleShowTicket = (venta) => {
    setSelectedVenta(venta);
    setShowTicket(true);
  };

  return (
    <Container fluid>
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
      
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Buscar por fecha..."
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
            <FaPlus /> Nueva Venta
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Productos</th>
            <th>Monto Total</th>
            <th>Vendedor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredVentas.map((venta) => (
            <tr key={venta.idVenta}>
              <td>{new Date(venta.fechaVenta).toLocaleDateString()}</td>
              <td>
                <ListGroup variant="flush" style={{maxHeight: '100px', overflowY: 'auto'}}>
                  {venta.productos.map((producto, idx) => (
                    <ListGroup.Item key={idx} className="py-1">
                      <small>
                        {producto.nombre} x {producto.cantidad} = 
                        ${producto.subtotal.toLocaleString('es-CO')}
                      </small>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </td>
              <td>${venta.montoTotal.toLocaleString('es-CO')}</td>
              <td>{venta.nombresVendedor}</td>
              <td>
                <Button 
                  variant="info" 
                  size="sm" 
                  className="me-2"
                  onClick={() => handleShowTicket(venta)}
                >
                  <FaReceipt /> Ticket
                </Button>
                <Button 
                  variant="warning" 
                  size="sm" 
                  className="me-2"
                  onClick={() => handleEdit(venta)}
                >
                  <FaEdit /> Editar
                </Button>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDelete(venta.idVenta)}
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
          <Modal.Title>
            <FaShoppingCart className="me-2" />
            {isEditing ? 'Editar Venta' : 'Nueva Venta'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="fechaVenta"
                    value={currentVenta.fechaVenta.split('.')[0]}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Vendedor</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentVenta.nombresVendedor}
                    disabled
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="border rounded p-3 mb-3">
              <h6 className="mb-3">Agregar Productos</h6>
              <Row className="align-items-end">
                <Col md={5}>
                  <Form.Group className="mb-3">
                    <Form.Label>Producto</Form.Label>
                    <Form.Select
                      name="productoId"
                      value={currentProducto.productoId}
                      onChange={handleProductoChange}
                    >
                      <option value="">Seleccione un producto</option>
                      {productos && productos.map((producto, index) => (
                        <option 
                          key={`producto-${producto?.idProducto || index}`} 
                          value={producto?.idProducto || ''}
                        >
                          {producto?.nombre || 'Producto sin nombre'} - ${(producto?.precio || 0).toLocaleString('es-CO')}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cantidad</Form.Label>
                    <Form.Control
                      type="number"
                      name="cantidad"
                      value={currentProducto.cantidad}
                      onChange={handleProductoChange}
                      min="1"
                      step="1"
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Button 
                    variant="secondary" 
                    className="w-100 mb-3"
                    onClick={handleAddProducto}
                  >
                    <FaPlus /> Agregar
                  </Button>
                </Col>
              </Row>
            </div>

            <div className="border rounded p-3 mb-3">
              <h6 className="d-flex justify-content-between align-items-center mb-3">
                <span>Productos en la Venta</span>
                <Badge bg="primary">
                  Total: ${currentVenta.montoTotal.toLocaleString('es-CO')}
                </Badge>
              </h6>
              <ListGroup variant="flush" style={{maxHeight: '200px', overflowY: 'auto'}}>
                {currentVenta.productos.map((producto, idx) => (
                  <ListGroup.Item 
                    key={idx}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{producto.nombre}</strong>
                      <br />
                      <small className="text-muted">
                        {producto.cantidad} x ${producto.precioUnitario.toLocaleString('es-CO')}
                      </small>
                    </div>
                    <div className="text-end">
                      <div className="mb-1">
                        <Badge bg="secondary">
                          ${producto.subtotal.toLocaleString('es-CO')}
                        </Badge>
                      </div>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleRemoveProducto(producto.productoId)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>

            <div className="text-end mt-3">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {isEditing ? 'Actualizar' : 'Registrar'} Venta
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de Ticket */}
      <TicketVenta 
        venta={selectedVenta}
        show={showTicket}
        onHide={() => {
          setShowTicket(false);
          setSelectedVenta(null);
        }}
      />
    </Container>
  );
};

export default VentasCRUD; 