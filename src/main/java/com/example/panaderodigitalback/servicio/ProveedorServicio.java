package com.example.panaderodigitalback.servicio;

import com.example.panaderodigitalback.modelo.Pedido;
import com.example.panaderodigitalback.modelo.Proveedor;
import com.example.panaderodigitalback.modelo.Usuario;
import com.example.panaderodigitalback.repositorio.PedidoRepositorio;
import com.example.panaderodigitalback.repositorio.ProveedorRepositorio;
import com.example.panaderodigitalback.repositorio.UsuarioRepositorio;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class ProveedorServicio implements IProveedorServicio {

    @Autowired
    private ProveedorRepositorio proveedorRepositorio;

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

    @Override
    public void eliminarProveedor(Long id) {
        proveedorRepositorio.eliminarProveedorPorId(id);
    }
}