package com.example.panaderodigitalback.controlador;

import com.example.panaderodigitalback.modelo.Producto;
import com.example.panaderodigitalback.servicio.ProductoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoServicio productoServicio;

    //Buscar todos los productos
    @GetMapping("/list")
    public List<Producto> buscarProductos() {
        return productoServicio.buscarProductos();
    }

    //Buscar producto por id
    @GetMapping("/list/{id}")
    public Producto buscarProductoPorId(@PathVariable String id) {
        return productoServicio.buscarProductoPorId(id);
    }

    // Agregar un producto
    @PostMapping("/")
    public ResponseEntity<Producto> agregarProducto(@RequestBody Producto producto) {
        Producto nuevoProducto = productoServicio.guardarProducto(producto);
        return new ResponseEntity<>(nuevoProducto, HttpStatus.CREATED);
    }

    // Editar un producto
    @PutMapping("/")
    public ResponseEntity<Producto> editarProducto(@RequestBody Producto producto) {
        String id = producto.getIdProducto();
        if(id == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Producto productoExistente = productoServicio.buscarProductoPorId(id);
        if(productoExistente != null) {
            Producto productoActualizado = productoServicio.guardarProducto(producto);
            return new ResponseEntity<>(productoActualizado, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Eliminar un producto por id
    @DeleteMapping("/{id}")
    public ResponseEntity<Producto> eliminarProducto(@PathVariable String id) {
        Producto productoExistente = productoServicio.buscarProductoPorId(id);
        if(productoExistente != null) {
            productoServicio.eliminarProducto(id);
            return new ResponseEntity<>(productoExistente, HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}