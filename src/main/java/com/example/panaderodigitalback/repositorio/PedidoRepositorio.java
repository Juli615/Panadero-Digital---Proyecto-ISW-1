package com.example.panaderodigitalback.repositorio;

import com.example.panaderodigitalback.modelo.Pedido;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PedidoRepositorio extends MongoRepository<Pedido, String> {
}