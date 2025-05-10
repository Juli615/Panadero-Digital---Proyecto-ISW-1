package com.example.panaderodigitalback.servicio;

import com.example.panaderodigitalback.modelo.Usuario;

import java.util.List;

public interface IUsuarioServicio {

    //Buscar todos los usuarios
    public List<Usuario> buscarUsuarios();

    //Buscar usuario por id
    public Usuario buscarUsuarioPorId(Long id);

    // Guardar usuario
    public Usuario guardarUsuario(Usuario usuario);

    // Eliminar usuario por id
    public void eliminarUsuario(Long id);
}
