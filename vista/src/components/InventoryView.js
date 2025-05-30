import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';

const InventoryView = () => {
  const [insumos, setInsumos] = useState([]);
  const [productos, setProductos] = useState([]);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [insumosRes, productosRes] = await Promise.all([
          fetch('http://localhost:8080/api/insumos', {
            headers: { 'Authorization': `Bearer ${auth.token}` },
          }),
          fetch('http://localhost:8080/api/productos', {
            headers: { 'Authorization': `Bearer ${auth.token}` },
          }),
        ]);
        if (!insumosRes.ok || !productosRes.ok) throw new Error('Error al cargar datos');
        setInsumos(await insumosRes.json());
        setProductos(await productosRes.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [auth.token]);

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title mb-4">Inventario</h3>
        <h4 className="mb-3">Insumos</h4>
        <table className="table table-striped table-bordered mb-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Unidad</th>
            </tr>
          </thead>
          <tbody>
            {insumos.map((insumo) => (
              <tr key={insumo.id}>
                <td>{insumo.id}</td>
                <td>{insumo.nombre}</td>
                <td>{insumo.cantidad}</td>
                <td>{insumo.unidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h4 className="mb-3">Productos</h4>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Unidad</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>{producto.nombre}</td>
                <td>{producto.cantidad}</td>
                <td>{producto.unidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryView;