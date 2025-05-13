package com.example.panaderodigitalback.repositorio;

import com.example.panaderodigitalback.modelo.Insumo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InsumoRepositorio extends MongoRepository<Insumo, String> {
}
