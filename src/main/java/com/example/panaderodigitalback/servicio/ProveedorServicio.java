package com.example.panaderodigitalback.servicio;

import com.example.panaderodigitalback.modelo.Pedido;
import com.example.panaderodigitalback.modelo.Proveedor;
import com.example.panaderodigitalback.modelo.Usuario;
import com.example.panaderodigitalback.repositorio.ProveedorRepositorio;
import com.example.panaderodigitalback.repositorio.UsuarioRepositorio;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class ProveedorServicio implements IProveedorServicio {

    @Autowired
    private ProveedorRepositorio proveedorRepositorio;

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Override
    public List<Proveedor> buscarProveedores() {
        return proveedorRepositorio.findAll();
    }

    @Override
    public Proveedor buscarProveedorPorId(Long id) {
        return proveedorRepositorio.findById(id).orElse(null);
    }

    @Override
    public Proveedor guardarProveedor(Proveedor proveedor) {
        return proveedorRepositorio.save(proveedor);
    }

    // Al borrar el proveedor, tambien borra el usuario asociado al mismo en una sola operacion
    @Override
    public void eliminarProveedor(Long id) {
        Proveedor proveedor = proveedorRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado con ID: " + id));

        Usuario usuario = proveedor.getUsuario();  //  Obtener el Usuario asociado

        proveedorRepositorio.deleteById(id);       //  Eliminar el Proveedor

        if (usuario != null) {
            usuarioRepositorio.deleteById(usuario.getId());  //  Eliminar el Usuario
        }
    }
}