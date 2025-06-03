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
  ListGroup
} from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaPlus } from 'react-icons/fa';

const ProductosCRUD = () => {
  // Estados
  const [productos, setProductos] = useState([]);
  const [insumos, setInsumos] = useState([]); // Lista de todos los insumos disponibles
  const [showModal, setShowModal] = useState(false);
  const [currentProducto, setCurrentProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '0.00',
    categoria: 'Panaderia',
    stock: 0,
    disponible: true,
    insumos: []
  });
  const [currentInsumo, setCurrentInsumo] = useState({
    insumoId: '',
    nombre: '',
    cantidadUsada: '0.00'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar productos e insumos
  useEffect(() => {
    fetchProductos();
    fetchInsumos();
  }, []);

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

  // Manejar cambios en el formulario principal
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = value;

    if (name === 'precio') {
      // Asegurar que el precio tenga formato decimal
      finalValue = value.replace(/[^0-9.]/g, '');
      if (finalValue.split('.').length > 2) return; // Evitar múltiples puntos decimales
    }

    setCurrentProducto(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : finalValue
    }));
  };

  // Manejar cambios en el formulario de insumos
  const handleInsumoChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === 'cantidadUsada') {
      // Asegurar que la cantidad tenga formato decimal
      finalValue = value.replace(/[^0-9.]/g, '');
      if (finalValue.split('.').length > 2) return;
    }

    setCurrentInsumo(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  // Agregar insumo a la lista del producto
  const handleAddInsumo = () => {
    if (!currentInsumo.insumoId || !currentInsumo.cantidadUsada) {
      setError('Por favor seleccione un insumo y especifique la cantidad');
      return;
    }

    const insumoSeleccionado = insumos.find(i => i.idInsumo === currentInsumo.insumoId);
    
    setCurrentProducto(prev => ({
      ...prev,
      insumos: [...prev.insumos, {
        insumoId: currentInsumo.insumoId,
        nombre: insumoSeleccionado.nombre,
        cantidadUsada: parseFloat(currentInsumo.cantidadUsada)
      }]
    }));

    setCurrentInsumo({
      insumoId: '',
      nombre: '',
      cantidadUsada: '0.00'
    });
  };

  // Remover insumo de la lista del producto
  const handleRemoveInsumo = (insumoId) => {
    setCurrentProducto(prev => ({
      ...prev,
      insumos: prev.insumos.filter(i => i.insumoId !== insumoId)
    }));
  };

  // Abrir modal para crear nuevo producto
  const handleCreate = () => {
    setCurrentProducto({
      nombre: '',
      descripcion: '',
      precio: '0.00',
      categoria: 'Panaderia',
      stock: 0,
      disponible: true,
      insumos: []
    });
    setIsEditing(false);
    setShowModal(true);
  };

  // Abrir modal para editar producto
  const handleEdit = (producto) => {
    setCurrentProducto(producto);
    setIsEditing(true);
    setShowModal(true);
  };

  // Guardar producto (crear o editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? 'http://localhost:8080/api/productos/editar'
        : 'http://localhost:8080/api/productos/agregar';
      
      // Preparar el producto para enviar
      const productoToSend = {
        ...currentProducto,
        precio: parseFloat(currentProducto.precio),
        insumos: currentProducto.insumos.map(insumo => ({
          insumoId: insumo.insumoId,
          nombre: insumo.nombre,
          cantidadUsada: parseFloat(insumo.cantidadUsada)
        }))
      };

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productoToSend)
      });

      if (!response.ok) throw new Error('Error al guardar el producto');
      
      setSuccess(isEditing ? 'Producto actualizado con éxito' : 'Producto creado con éxito');
      setShowModal(false);
      fetchProductos();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/productos/eliminar/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar el producto');
        
        setSuccess('Producto eliminado con éxito');
        fetchProductos();
        
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Filtrar productos según término de búsqueda
  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid>
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
      
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Buscar productos..."
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
            <FaPlus /> Nuevo Producto
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Disponible</th>
            <th style={{ width: '25%' }}>Insumos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProductos.map((producto) => (
            <tr key={producto.idProducto}>
              <td>{producto.nombre}</td>
              <td>{producto.descripcion}</td>
              <td>${Number(producto.precio).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td>{producto.categoria}</td>
              <td>{producto.stock}</td>
              <td>{producto.disponible ? 'Sí' : 'No'}</td>
              <td>
                <ListGroup variant="flush" style={{maxHeight: '100px', overflowY: 'auto', fontSize: '0.9em'}}>
                  {producto.insumos && producto.insumos.map((insumo, idx) => (
                    <ListGroup.Item key={idx} className="py-2 px-2 d-flex justify-content-between align-items-center">
                      <span className="fw-bold">{insumo.nombre}</span>
                      <span className="badge bg-secondary">
                        {Number(insumo.cantidadUsada).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </td>
              <td>
                <Button 
                  variant="warning" 
                  size="sm" 
                  className="me-2"
                  onClick={() => handleEdit(producto)}
                >
                  <FaEdit /> Editar
                </Button>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDelete(producto.idProducto)}
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
          <Modal.Title>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={currentProducto.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="descripcion"
                    value={currentProducto.descripcion}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    name="categoria"
                    value={currentProducto.categoria}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccione una categoría</option>
                    <option value="Panaderia">Panadería</option>
                    <option value="Pasteleria">Pastelería</option>
                    <option value="Galleteria">Galletería</option>
                    <option value="Reposteria">Repostería</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Precio</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="precio"
                      value={currentProducto.precio}
                      onChange={handleInputChange}
                      required
                      pattern="^\d*\.?\d{0,2}$"
                      title="Ingrese un precio válido (máximo 2 decimales)"
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={currentProducto.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Disponible"
                    name="disponible"
                    checked={currentProducto.disponible}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <h5>Insumos necesarios</h5>
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
                    <Form.Label>Cantidad Usada</Form.Label>
                    <Form.Control
                      type="text"
                      name="cantidadUsada"
                      value={currentInsumo.cantidadUsada}
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
                    {currentProducto.insumos.map((insumo, idx) => (
                      <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center py-2">
                        <div>
                          <span className="fw-bold">{insumo.nombre}</span>
                          <br />
                          <small className="text-muted">
                            Cantidad: {Number(insumo.cantidadUsada).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </small>
                        </div>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleRemoveInsumo(insumo.insumoId)}
                        >
                          <FaTrash />
                        </Button>
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

export default ProductosCRUD; 