import React, { useState, useEffect } from 'react';

const Inventario = ({ token }) => {
  const [insumos, setInsumos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/inventario', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Error al cargar el inventario');
        const data = await response.json();
        setInsumos(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchInsumos();
  }, [token]);

  return (
    <div className="card">
      <h3>Inventario</h3>
      {error && <p className="error">{error}</p>}
      {insumos.length > 0 ? (
        <ul>
          {insumos.map((insumo) => (
            <li key={insumo.id}>
              {insumo.nombre} - Cantidad: {insumo.cantidad} {insumo.unidad}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay insumos en el inventario.</p>
      )}
    </div>
  );
};

export default Inventario;