import React, { useState, useEffect } from 'react';

const CrearPedido = ({ token }) => {
  const [proveedores, setProveedores] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState('');
  const [selectedInsumo, setSelectedInsumo] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [proveedoresRes, insumosRes] = await Promise.all([
          fetch('http://localhost:8080/api/proveedores', {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          fetch('http://localhost:8080/api/inventario', {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
        ]);
        if (!proveedoresRes.ok || !insumosRes.ok) throw new Error('Error al cargar datos');
        const proveedoresData = await proveedoresRes.json();
        const insumosData = await insumosRes.json();
        setProveedores(proveedoresData);
        setInsumos(insumosData);
      } catch (err) {
        setMessage('Error: ' + err.message);
      }
    };
    fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          proveedorId: selectedProveedor,
          insumoId: selectedInsumo,
          cantidad: parseInt(cantidad),
        }),
      });
      if (!response.ok) throw new Error('Error al crear el pedido');
      setMessage('Pedido creado exitosamente');
      setSelectedProveedor('');
      setSelectedInsumo('');
      setCantidad('');
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  return (
    <div className="card">
      <h3>Crear Pedido</h3>
      {message && <p className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Proveedor</label>
          <select
            value={selectedProveedor}
            onChange={(e) => setSelectedProveedor(e.target.value)}
            required
          >
            <option value="">Seleccione un proveedor</option>
            {proveedores.map((proveedor) => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Insumo</label>
          <select
            value={selectedInsumo}
            onChange={(e) => setSelectedInsumo(e.target.value)}
            required
          >
            <option value="">Seleccione un insumo</option>
            {insumos.map((insumo) => (
              <option key={insumo.id} value={insumo.id}>
                {insumo.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Cantidad</label>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
          />
        </div>
        <button type="submit">Crear Pedido</button>
      </form>
    </div>
  );
};

export default CrearPedido;