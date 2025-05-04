package com.example.panaderodigitalback.controlador;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/protegido")
    public ResponseEntity<String> protegido() {
        return ResponseEntity.ok("¡Este endpoint está protegido y has accedido con un token válido!");
    }
}
