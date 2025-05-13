package com.example.panaderodigitalback.repositorio;

import com.example.panaderodigitalback.modelo.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepositorio extends MongoRepository<Usuario, String> {
    //Se deja para que funcione el login
    Optional<Usuario> findByCorreoElectronico(String correoElectronico);
}
