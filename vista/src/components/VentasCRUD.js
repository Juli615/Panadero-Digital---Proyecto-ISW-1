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
import { FaEdit, FaTrash, FaSearch, FaPlus, FaShoppingCart, FaCalculator, FaReceipt, FaChartLine } from 'react-icons/fa';
import TicketVenta from './TicketVenta';
import ReportesVentas from './ReportesVentas';

const VentasCRUD = ({ usuarioId }) => {
  // Estados
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentVenta, setCurrentVenta] = useState({
    usuarioId: usuarioId,
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
  const [showReportes, setShowReportes] = useState(false);

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
      const userInfo = getUserInfo();
      if (!userInfo) return;

      const response = await fetch('http://localhost:8080/api/ventas/list');
      if (!response.ok) throw new Error('Error al cargar las ventas');
      let data = await response.json();

      // Si el usuario es vendedor, filtrar solo sus ventas
      if (userInfo.rol === 'vendedor') {
        data = data.filter(venta => venta.usuarioId === userInfo.id);
      }

      setVentas(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Obtener productos
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

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentVenta(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambios en el producto actual
  const handleProductoChange = (e) => {
    const { name, value } = e.target;
    if (name === 'productoId') {
      const producto = productos.find(p => p.idProducto === value);
      if (producto) {
        setCurrentProducto(prev => ({
          ...prev,
          productoId: value,
          nombre: producto.nombre,
          precioUnitario: producto.precio,
          subtotal: producto.precio * prev.cantidad
        }));
      }
    } else if (name === 'cantidad') {
      const cantidad = parseFloat(value) || 0;
      setCurrentProducto(prev => ({
        ...prev,
        cantidad,
        subtotal: prev.precioUnitario * cantidad
      }));
    }
  };

  // Agregar producto a la venta
  const handleAgregarProducto = () => {
    if (!currentProducto.productoId || currentProducto.cantidad <= 0) {
      setError('Por favor seleccione un producto y una cantidad válida');
      return;
    }

    setCurrentVenta(prev => {
      const productos = [...prev.productos];
      const index = productos.findIndex(p => p.productoId === currentProducto.productoId);

      if (index >= 0) {
        productos[index] = currentProducto;
      } else {
        productos.push(currentProducto);
      }

      return {
        ...prev,
        productos,
        montoTotal: productos.reduce((sum, p) => sum + p.subtotal, 0)
      };
    });

    setCurrentProducto({
      productoId: '',
      nombre: '',
      precioUnitario: 0,
      cantidad: 1,
      subtotal: 0
    });
  };

  // Eliminar producto de la venta
  const handleQuitarProducto = (productoId) => {
    setCurrentVenta(prev => {
      const productos = prev.productos.filter(p => p.productoId !== productoId);
      return {
        ...prev,
        productos,
        montoTotal: productos.reduce((sum, p) => sum + p.subtotal, 0)
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
    const userInfo = getUserInfo();
    if (!userInfo) return;

    // Si es vendedor, solo puede editar sus propias ventas
    if (userInfo.rol === 'vendedor' && venta.usuarioId !== userInfo.id) {
      setError('No tiene permiso para editar esta venta');
      return;
    }

    setCurrentVenta(venta);
    setIsEditing(true);
    setShowModal(true);
  };

  // Guardar venta
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInfo = getUserInfo();
    if (!userInfo) return;

    try {
      if (currentVenta.productos.length === 0) {
        setError('Debe agregar al menos un producto a la venta');
        return;
      }

      const url = isEditing 
        ? 'http://localhost:8080/api/ventas/editar'
        : 'http://localhost:8080/api/ventas/agregar';

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentVenta)
      });

      if (!response.ok) throw new Error('Error al guardar la venta');
      
      setSuccess(isEditing ? 'Venta actualizada con éxito' : 'Venta creada con éxito');
      setShowModal(false);
      fetchVentas();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar venta
  const handleDelete = async (id) => {
    const userInfo = getUserInfo();
    if (!userInfo) return;

    // Si es vendedor, solo puede eliminar sus propias ventas
    const venta = ventas.find(v => v.idVenta === id);
    if (userInfo.rol === 'vendedor' && venta && venta.usuarioId !== userInfo.id) {
      setError('No tiene permiso para eliminar esta venta');
      return;
    }

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

  // Mostrar ticket de venta
  const handleShowTicket = (venta) => {
    setSelectedVenta(venta);
    setShowTicket(true);
  };

  // Filtrar ventas según término de búsqueda
  const filteredVentas = ventas.filter(venta =>
    venta.nombresVendedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.productos.some(producto => 
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Container fluid>
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
      
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Buscar por vendedor o producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
          </InputGroup>
        </Col>
        <Col md={6} className="text-end">
          <Button variant="primary" onClick={handleCreate} className="me-2">
            <FaPlus /> Nueva Venta
          </Button>
          {getUserInfo()?.rol === 'admin' && (
            <Button variant="info" onClick={() => setShowReportes(true)}>
              <FaChartLine /> Ver Reportes
            </Button>
          )}
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

      {/* Modal de Venta */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaShoppingCart className="me-2" />
            {isEditing ? 'Editar Venta' : 'Nueva Venta'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Vendedor</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentVenta.nombresVendedor}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="fechaVenta"
                    value={currentVenta.fechaVenta.split('.')[0]}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="border rounded p-3 mb-3">
              <h6>Agregar Producto</h6>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Producto</Form.Label>
                    <Form.Select
                      name="productoId"
                      value={currentProducto.productoId}
                      onChange={handleProductoChange}
                    >
                      <option value="">Seleccione un producto</option>
                      {productos.map(producto => (
                        <option key={producto.idProducto} value={producto.idProducto}>
                          {producto.nombre} - ${producto.precio}
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
                    />
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button 
                    variant="success" 
                    onClick={handleAgregarProducto}
                    className="w-100 mb-3"
                  >
                    <FaPlus /> Agregar
                  </Button>
                </Col>
              </Row>
            </div>

            <div className="border rounded p-3 mb-3">
              <h6>Productos en la Venta</h6>
              <ListGroup>
                {currentVenta.productos.map((producto, idx) => (
                  <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
                    <div>
                      {producto.nombre} x {producto.cantidad}
                    </div>
                    <div>
                      <span className="me-3">
                        ${producto.subtotal.toLocaleString('es-CO')}
                      </span>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleQuitarProducto(producto.productoId)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <div className="text-end mt-3">
                <h5>Total: ${currentVenta.montoTotal.toLocaleString('es-CO')}</h5>
              </div>
            </div>

            <div className="text-end">
              <Button variant="secondary" onClick={() => setShowModal(false)} className="me-2">
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {isEditing ? 'Actualizar' : 'Crear'} Venta
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de Ticket */}
      <TicketVenta
        show={showTicket}
        onHide={() => setShowTicket(false)}
        venta={selectedVenta}
      />

      {/* Modal de Reportes */}
      <ReportesVentas
        show={showReportes}
        onHide={() => setShowReportes(false)}
      />
    </Container>
  );
};

export default VentasCRUD; 