package com.example.panaderodigitalback.controlador;

import com.example.panaderodigitalback.modelo.Proveedor;
import com.example.panaderodigitalback.servicio.ProveedorServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/proveedores")
public class ProveedorController {

    @Autowired
    private ProveedorServicio proveedorServicio;

    //Buscar todos los proveedores
    @GetMapping("/list")
    public ResponseEntity<List<Proveedor>> buscarProveedores() {
        List<Proveedor> proveedores = proveedorServicio.buscarProveedores();
        return new ResponseEntity<>(proveedores, HttpStatus.OK);
    }

    // Buscar proveedor por id
    @GetMapping("/list/{id}")
    public ResponseEntity<Proveedor> buscarProveedorPorId(@PathVariable Long id) {
        Proveedor proveedor = proveedorServicio.buscarProveedorPorId(id);
        if (proveedor != null) {
            return new ResponseEntity<>(proveedor, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //Agregar un proveedor
    @PostMapping("/")
    public ResponseEntity<Proveedor> agregarProveedor(@RequestBody Proveedor proveedor) {
        Proveedor nuevoProveedor = proveedorServicio.guardarProveedor(proveedor);
        return new ResponseEntity<>(nuevoProveedor, HttpStatus.CREATED);
    }

    /* Editar un proveedor, es importante que al querer editar
    la info del proveedor OBLIGATORIAMENTE se envie el id del usuario asociado */
    @PutMapping("/")
    public ResponseEntity<Proveedor> editarProveedor(@RequestBody Proveedor proveedor) {
        Long id = proveedor.getIdProveedor();
        if(id == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Proveedor proveedorExistente = proveedorServicio.buscarProveedorPorId(id);
        if(proveedorExistente != null) {
            Proveedor proveedorActualizado = proveedorServicio.guardarProveedor(proveedor);
            return new ResponseEntity<>(proveedorActualizado, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Eliminar un proveedor por id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProveedor(@PathVariable Long id) {
        try {
            proveedorServicio.eliminarProveedor(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); //  204 No Content (éxito, sin contenido en la respuesta)
        } catch (RuntimeException e) {
            //  Manejar la excepción (por ejemplo, Proveedor no encontrado)
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); //  404 Not Found
        }
    }
}