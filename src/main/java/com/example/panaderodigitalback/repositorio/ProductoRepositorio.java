package com.example.panaderodigitalback.repositorio;

import com.example.panaderodigitalback.modelo.Producto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepositorio extends MongoRepository<Producto, String> {
}
