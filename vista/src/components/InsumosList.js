import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const InsumosList = () => {
  const [insumos, setInsumos] = useState([]);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/insumos', {
          headers: { 'Authorization': `Bearer ${auth.token}` },
        });
        if (!response.ok) throw new Error('Error al cargar insumos');
        const data = await response.json();
        setInsumos(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInsumos();
  }, [auth.token]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/insumos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${auth.token}` },
      });
      if (response.ok) {
        setInsumos(insumos.filter((insumo) => insumo.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title mb-4">Lista de Insumos</h3>
        <Link to="/admin/insumo" className="btn btn-success mb-3">Agregar Insumo</Link>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Unidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {insumos.map((insumo) => (
              <tr key={insumo.id}>
                <td>{insumo.id}</td>
                <td>{insumo.nombre}</td>
                <td>{insumo.cantidad}</td>
                <td>{insumo.unidad}</td>
                <td>
                  <Link to={`/admin/insumo/${insumo.id}`} className="btn btn-primary btn-sm me-2">Editar</Link>
                  <button onClick={() => handleDelete(insumo.id)} className="btn btn-danger btn-sm">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InsumosList;