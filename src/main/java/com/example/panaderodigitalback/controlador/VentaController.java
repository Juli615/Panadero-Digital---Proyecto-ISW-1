package com.example.panaderodigitalback.controlador;

import com.example.panaderodigitalback.modelo.Venta;
import com.example.panaderodigitalback.servicio.VentaServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    @Autowired
    private VentaServicio ventaServicio;

    //Buscar todas las ventas
    @GetMapping("/list")
    public List<Venta> buscarVentas() {
        return ventaServicio.buscarVentas();
    }

    //Buscar venta por id
    @GetMapping("/list/{id}")
    public Venta buscarVentaPorId(@PathVariable("id") String id) {
        return ventaServicio.buscarVentaPorId(id);
    }

    //Agregar una venta
    //Los datos se pasan en el cuerpo de la peticion
    @PostMapping("/agregar")
    public ResponseEntity<Venta> agregarVenta(@RequestBody Venta venta) {
        Venta nuevaVenta = ventaServicio.guardarVenta(venta);
        return new ResponseEntity<>(nuevaVenta, HttpStatus.CREATED);
    }

    //Editar una venta
    //El id se pasa en el cuerpo de la peticion
    @PutMapping("/editar")
    public ResponseEntity<Venta> editarVenta(@RequestBody Venta venta) {
        String id = venta.getIdVenta();
        if (id == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Venta ventaExistente = ventaServicio.buscarVentaPorId(id);
        if(ventaExistente != null) {
            Venta ventaActualizada = ventaServicio.guardarVenta(venta);
            return new ResponseEntity<>(ventaActualizada, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //Eliminar una venta por id
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Venta> eliminarVenta(@PathVariable("id") String id) {
        Venta ventaExistente = ventaServicio.buscarVentaPorId(id);
        if(ventaExistente != null) {
            ventaServicio.eliminarVenta(id);
            return new ResponseEntity<>(ventaExistente, HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
