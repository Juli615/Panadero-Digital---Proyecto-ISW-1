package com.example.panaderodigitalback.controlador;

import com.example.panaderodigitalback.modelo.Insumo;
import com.example.panaderodigitalback.servicio.InsumoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/insumos")
public class InsumoController {

    @Autowired
    private InsumoServicio insumoServicio;

    //Buscar todos los insumos
    @GetMapping("/list")
    public List<Insumo> buscarInsumos() {
        return insumoServicio.buscarInsumos();
    }

    //Buscar insumo por id
    @GetMapping("/list/{id}")
    public Insumo buscarInsumoPorId(@PathVariable("id") String idInsumo) {
        return insumoServicio.buscarInsumoPorId(idInsumo);
    }

    // Agregar un insumo
    // Los datos se pasan en el cuerpo de la peticion
    @PostMapping("/agregar")
    public ResponseEntity<Insumo> agregarInsumo(@RequestBody Insumo insumo) {
        Insumo nuevoInsumo = insumoServicio.guardarInsumo(insumo);
        return new ResponseEntity<>(nuevoInsumo, HttpStatus.CREATED);
    }

    //Editar un insumo
    // El id se pasa en el cuerpo de la peticion
    @PutMapping("/editar")
    public ResponseEntity<Insumo> editarInsumo(@RequestBody Insumo insumo) {
        String idInsumo = insumo.getIdInsumo();
        if(idInsumo == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Insumo insumoExistente = insumoServicio.buscarInsumoPorId(idInsumo);
        if(insumoExistente != null) {
            Insumo insumoActualizado = insumoServicio.guardarInsumo(insumo);
            return new ResponseEntity<>(insumoActualizado, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //Eliminar un insumo por id
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Insumo> eliminarInsumo(@PathVariable("id") String idInsumo) {
        Insumo insumoExistente = insumoServicio.buscarInsumoPorId(idInsumo);
        if(insumoExistente != null) {
            insumoServicio.eliminarInsumo(idInsumo);
            return new ResponseEntity<>(insumoExistente, HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
