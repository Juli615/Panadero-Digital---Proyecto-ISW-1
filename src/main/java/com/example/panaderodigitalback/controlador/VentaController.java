package com.example.panaderodigitalback.controlador;

import com.example.panaderodigitalback.modelo.Venta;
import com.example.panaderodigitalback.servicio.VentaServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "*")
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
    public ResponseEntity<?> buscarVentaPorId(@PathVariable("id") String id) {
        try {
            Venta venta = ventaServicio.buscarVentaPorId(id);
            if (venta != null) {
                return new ResponseEntity<>(venta, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al buscar la venta: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Agregar una venta
    //Los datos se pasan en el cuerpo de la peticion
    @PostMapping("/agregar")
    public ResponseEntity<?> agregarVenta(@RequestBody Venta venta) {
        try {
            Venta nuevaVenta = ventaServicio.guardarVenta(venta);
            return new ResponseEntity<>(nuevaVenta, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al procesar la venta: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Editar una venta
    //El id se pasa en el cuerpo de la peticion
    @PutMapping("/editar")
    public ResponseEntity<?> editarVenta(@RequestBody Venta venta) {
        try {
            String id = venta.getIdVenta();
            if (id == null) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "El ID de la venta es requerido");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            Venta ventaExistente = ventaServicio.buscarVentaPorId(id);
            if (ventaExistente != null) {
                Venta ventaActualizada = ventaServicio.guardarVenta(venta);
                return new ResponseEntity<>(ventaActualizada, HttpStatus.OK);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Venta no encontrada");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al actualizar la venta: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Eliminar una venta por id
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarVenta(@PathVariable("id") String id) {
        try {
            Venta ventaExistente = ventaServicio.buscarVentaPorId(id);
            if (ventaExistente != null) {
                ventaServicio.eliminarVenta(id);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Venta no encontrada");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al eliminar la venta: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
