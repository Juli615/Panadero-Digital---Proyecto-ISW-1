package com.example.panaderodigitalback.servicio;

import com.example.panaderodigitalback.modelo.DetallePedido;
import com.example.panaderodigitalback.modelo.Pedido;
import com.example.panaderodigitalback.repositorio.DetallePedidoRepositorio;
import com.example.panaderodigitalback.repositorio.PedidoRepositorio;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class PedidoServicio implements IPedidoServicio{

    @Autowired
    private PedidoRepositorio pedidoRepositorio;

    @Autowired
    private DetallePedidoRepositorio detallePedidoRepositorio;

    @Override
    public List<Pedido> buscarPedidos() {
        return pedidoRepositorio.findAll();
    }

    @Override
    public Pedido buscarPedidoPorId(Long id) {
        return pedidoRepositorio.findById(id).orElse(null);
    }

    @Override
    public Pedido guardarPedido(Pedido pedido) {
        return pedidoRepositorio.save(pedido);
    }

    // Al borrar un pedido, se borran tambien los detallesPedido asociados a este
    @Override
    public void eliminarPedido(Long id) {
        Pedido pedido = pedidoRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        // Eliminar DetallePedido asociados
        List<DetallePedido> detallesPedido = pedido.getDetallesPedido();
        for (DetallePedido detalle : detallesPedido) {
            detalle.setPedido(null); // Desvincular (importante)
            detallePedidoRepositorio.delete(detalle);
        }

        pedidoRepositorio.deleteById(id);
    }
}