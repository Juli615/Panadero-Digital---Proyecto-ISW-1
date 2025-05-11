package com.example.panaderodigitalback.servicio;

import com.example.panaderodigitalback.modelo.Proveedor;

import java.util.List;

public interface IProveedorServicio {

    // Buscar todos los proveedores
    List<Proveedor> buscarProveedores();

    // Buscar proveedor por id
    Proveedor buscarProveedorPorId(Long id);

    // Guardar proveedor
    Proveedor guardarProveedor(Proveedor proveedor);

    // Eliminar proveedor por id
    void eliminarProveedor(Long id);
}
