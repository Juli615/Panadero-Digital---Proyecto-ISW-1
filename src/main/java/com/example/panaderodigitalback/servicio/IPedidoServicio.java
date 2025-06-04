package com.example.panaderodigitalback.servicio;

import com.example.panaderodigitalback.modelo.Pedido;

import java.util.List;

public interface IPedidoServicio {

    // Buscar todos los pedidos
    List<Pedido> buscarPedidos();

    // Buscar un pedido por ID
    Pedido buscarPedidoPorId(String id);

    // Buscar pedidos por proveedor
    List<Pedido> buscarPedidosPorProveedor(String proveedorId);

    // Guardar pedido
    Pedido guardarPedido(Pedido pedido);

    // Eliminar un pedido por id
    void eliminarPedido(String id);
}
