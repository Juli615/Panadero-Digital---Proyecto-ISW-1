package com.example.panaderodigitalback.servicio;

import com.example.panaderodigitalback.modelo.Producto;

import java.util.List;

public interface IProductoServicio {

    //Buscar todos los productos
    List<Producto> buscarProductos();

    //Buscar producto por id
    Producto buscarProductoPorId(String id);

    //Guardar producto
    Producto guardarProducto(Producto producto);

    //Eliminar producto por id
    void eliminarProducto(String id);
}