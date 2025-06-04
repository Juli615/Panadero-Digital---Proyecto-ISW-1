package com.example.panaderodigitalback.servicio;

import com.example.panaderodigitalback.modelo.Usuario;

import java.util.List;

public interface IUsuarioServicio {

    //Buscar todos los usuarios
    List<Usuario> buscarUsuarios();

    //Buscar usuario por id
    Usuario buscarUsuarioPorId(String id);

    // Guardar usuario
    Usuario guardarUsuario(Usuario usuario);

    // Eliminar usuario por id
    void eliminarUsuario(String id);

    // Verificar si existe un usuario con el correo electrónico dado
    boolean existeCorreoElectronico(String correoElectronico);
}