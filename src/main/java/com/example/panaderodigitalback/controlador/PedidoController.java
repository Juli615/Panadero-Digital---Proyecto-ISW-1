package com.example.panaderodigitalback.controlador;

import com.example.panaderodigitalback.modelo.Pedido;
import com.example.panaderodigitalback.servicio.PedidoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoServicio pedidoServicio;

    // Buscar todos los pedidos
    @GetMapping("/list")
    public List<Pedido> buscarPedidos() {
        return pedidoServicio.buscarPedidos();
    }

    // Buscar pedido por id
    @GetMapping("/list/{id}")
    public Pedido buscarPedidoPorId(@PathVariable Long id) {
        return pedidoServicio.buscarPedidoPorId(id);
    }

    // Agregar un pedido
   @PostMapping("/")
    public ResponseEntity<Pedido> agregarPedido(@RequestBody Pedido pedido) {
        Pedido nuevoPedido = pedidoServicio.guardarPedido(pedido);
        return new ResponseEntity<>(nuevoPedido, HttpStatus.CREATED);
    }

    // Editar un pedido
    @PutMapping("/")
    public ResponseEntity<Pedido> editarPedido(@RequestBody Pedido pedido) {
        Long id = pedido.getIdPedido();
        if (id == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Pedido pedidoExistente = pedidoServicio.buscarPedidoPorId(id);
        if (pedidoExistente != null) {
            Pedido pedidoActualizado = pedidoServicio.guardarPedido(pedido);
            return new ResponseEntity<>(pedidoActualizado, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Eliminar pedido por id
    @DeleteMapping("/{id}")
    public ResponseEntity<Pedido> eliminarPedido(@PathVariable Long id) {
        Pedido pedidoExistente = pedidoServicio.buscarPedidoPorId(id);
        if(pedidoExistente != null) {
            pedidoServicio.eliminarPedido(id);
            return new ResponseEntity<>(pedidoExistente, HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}