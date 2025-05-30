import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Cambiar useHistory por useNavigate
import { AuthContext } from '../AuthContext';

const ProductForm = () => {
  const [producto, setProducto] = useState({ nombre: '', cantidad: '', unidad: '' });
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchProducto = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/productos/${id}`, {
            headers: { 'Authorization': `Bearer ${auth.token}` },
          });
          if (!response.ok) throw new Error('Error al cargar producto');
          const data = await response.json();
          setProducto(data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchProducto();
    }
  }, [id, auth.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = id ? 'PUT' : 'POST';
      const url = id ? `http://localhost:8080/api/productos/${id}` : 'http://localhost:8080/api/productos';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify(producto),
      });
      if (response.ok) {
        navigate('/admin/productos');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title mb-4">{id ? 'Editar Producto' : 'Agregar Producto'}</h3>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input
            type="text"
            id="nombre"
            className="form-control"
            value={producto.nombre}
            onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cantidad" className="form-label">Cantidad</label>
          <input
            type="number"
            id="cantidad"
            className="form-control"
            value={producto.cantidad}
            onChange={(e) => setProducto({ ...producto, cantidad: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="unidad" className="form-label">Unidad</label>
          <input
            type="text"
            id="unidad"
            className="form-control"
            value={producto.unidad}
            onChange={(e) => setProducto({ ...producto, unidad: e.target.value })}
            required
          />
        </div>
        <button onClick={handleSubmit} className="btn btn-primary">Guardar</button>
      </div>
    </div>
  );
};

export default ProductForm;