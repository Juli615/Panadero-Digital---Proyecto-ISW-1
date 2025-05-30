import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const ProductsList = () => {
  const [productos, setProductos] = useState([]);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/productos', {
          headers: { 'Authorization': `Bearer ${auth.token}` },
        });
        if (!response.ok) throw new Error('Error al cargar productos');
        const data = await response.json();
        setProductos(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProductos();
  }, [auth.token]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/productos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${auth.token}` },
      });
      if (response.ok) {
        setProductos(productos.filter((producto) => producto.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title mb-4">Lista de Productos</h3>
        <Link to="/admin/producto" className="btn btn-success mb-3">Agregar Producto</Link>
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
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>{producto.nombre}</td>
                <td>{producto.cantidad}</td>
                <td>{producto.unidad}</td>
                <td>
                  <Link to={`/admin/producto/${producto.id}`} className="btn btn-primary btn-sm me-2">Editar</Link>
                  <button onClick={() => handleDelete(producto.id)} className="btn btn-danger btn-sm">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsList;