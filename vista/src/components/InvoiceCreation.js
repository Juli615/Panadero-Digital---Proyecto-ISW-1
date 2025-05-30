import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';

const InvoiceCreation = () => {
  const [productos, setProductos] = useState([]);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [message, setMessage] = useState('');
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/productos', {
          headers: { 'Authorization': `Bearer ${auth.token}` },
        });
        if (!response.ok) throw new Error('Error al cargar productos');
        setProductos(await response.json());
      } catch (err) {
        setMessage('Error: ' + err.message);
      }
    };
    fetchProductos();
  }, [auth.token]);

  const addToInvoice = (producto) => {
    setInvoiceItems([...invoiceItems, { ...producto, cantidad: 1 }]);
  };

  const updateQuantity = (id, cantidad) => {
    setInvoiceItems(
      invoiceItems.map((item) =>
        item.id === id ? { ...item, cantidad: parseInt(cantidad) } : item
      )
    );
  };

  const removeFromInvoice = (id) => {
    setInvoiceItems(invoiceItems.filter((item) => item.id !== id));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/facturas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ items: invoiceItems }),
      });
      if (!response.ok) throw new Error('Error al crear factura');
      setMessage('Factura creada exitosamente');
      setInvoiceItems([]);
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title mb-4">Crear Factura</h3>
        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
            {message}
          </div>
        )}
        <h4 className="mb-3">Productos Disponibles</h4>
        <table className="table table-striped table-bordered mb-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>{producto.nombre}</td>
                <td>
                  <button
                    onClick={() => addToInvoice(producto)}
                    className="btn btn-primary btn-sm"
                  >
                    Añadir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h4 className="mb-3">Productos en Factura</h4>
        <table className="table table-striped table-bordered mb-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {invoiceItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.nombre}</td>
                <td>
                  <input
                    type="number"
                    className="form-control w-25 d-inline"
                    value={item.cantidad}
                    onChange={(e) => updateQuantity(item.id, e.target.value)}
                    min="1"
                  />
                </td>
                <td>
                  <button
                    onClick={() => removeFromInvoice(item.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoiceItems.length > 0 && (
          <button onClick={handleSubmit} className="btn btn-success">Generar Factura</button>
        )}
      </div>
    </div>
  );
};

export default InvoiceCreation;