package com.example.panaderodigitalback.repositorio;

import com.example.panaderodigitalback.modelo.Venta;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VentaRepositorio extends MongoRepository<Venta, String> {
}
