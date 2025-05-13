package com.example.panaderodigitalback.servicio;

import com.example.panaderodigitalback.modelo.Pedido;
import com.example.panaderodigitalback.repositorio.PedidoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PedidoServicio implements IPedidoServicio{

    @Autowired
    private PedidoRepositorio pedidoRepositorio;

    @Override
    public List<Pedido> buscarPedidos() {
        return pedidoRepositorio.findAll();
    }

    @Override
    public Pedido buscarPedidoPorId(String id) {
        return pedidoRepositorio.findById(id).orElse(null);
    }

    @Override
    public Pedido guardarPedido(Pedido pedido) {
        return pedidoRepositorio.save(pedido);
    }

    // Al borrar un pedido, se borran tambien los detallesPedido asociados a este
    @Override
    public void eliminarPedido(String id) {
        pedidoRepositorio.deleteById(id);
    }
}