package com.example.panaderodigitalback.servicio;

import com.example.panaderodigitalback.modelo.Usuario;
import com.example.panaderodigitalback.repositorio.UsuarioRepositorio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioServicio implements IUsuarioServicio {

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Override
    public List<Usuario> buscarUsuarios() {
        return usuarioRepositorio.findAll();
    }

    @Override
    public Usuario buscarUsuarioPorId(String id) {
        return usuarioRepositorio.findById(id).orElse(null);
    }

    @Override
    public Usuario guardarUsuario(Usuario usuario) {
        // Si es una actualización (el usuario ya existe)
        if (usuario.getId() != null) {
            Usuario usuarioExistente = buscarUsuarioPorId(usuario.getId());
            if (usuarioExistente != null) {
                // Si la contraseña viene vacía o null, mantener la contraseña existente
                if (usuario.getPassword() == null || usuario.getPassword().trim().isEmpty()) {
                    usuario.setPassword(usuarioExistente.getPassword());
                }
            }
        }
        return usuarioRepositorio.save(usuario);
    }

    @Override
    public void eliminarUsuario(String id) {
        usuarioRepositorio.deleteById(id);
    }
}