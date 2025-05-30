import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const InsumoForm = () => {
  const [insumo, setInsumo] = useState({ nombre: '', cantidad: '', unidad: '' });
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchInsumo = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/insumos/${id}`, {
            headers: { 'Authorization': `Bearer ${auth.token}` },
          });
          if (!response.ok) throw new Error('Error al cargar insumo');
          const data = await response.json();
          setInsumo(data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchInsumo();
    }
  }, [id, auth.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = id ? 'PUT' : 'POST';
      const url = id ? `http://localhost:8080/api/insumos/${id}` : 'http://localhost:8080/api/insumos';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify(insumo),
      });
      if (response.ok) {
        navigate('/admin/insumos');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title mb-4">{id ? 'Editar Insumo' : 'Agregar Insumo'}</h3>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input
            type="text"
            id="nombre"
            className="form-control"
            value={insumo.nombre}
            onChange={(e) => setInsumo({ ...insumo, nombre: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cantidad" className="form-label">Cantidad</label>
          <input
            type="number"
            id="cantidad"
            className="form-control"
            value={insumo.cantidad}
            onChange={(e) => setInsumo({ ...insumo, cantidad: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="unidad" className="form-label">Unidad</label>
          <input
            type="text"
            id="unidad"
            className="form-control"
            value={insumo.unidad}
            onChange={(e) => setInsumo({ ...insumo, unidad: e.target.value })}
            required
          />
        </div>
        <button onClick={handleSubmit} className="btn btn-primary">Guardar</button>
      </div>
    </div>
  );
};

export default InsumoForm;