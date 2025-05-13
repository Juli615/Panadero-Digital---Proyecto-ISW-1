package com.example.panaderodigitalback.servicio;

import com.example.panaderodigitalback.modelo.Venta;
import com.example.panaderodigitalback.repositorio.VentaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class VentaServicio implements IVentaServicio {

    @Autowired
    private VentaRepositorio ventaRepositorio;

    @Override
    public List<Venta> buscarVentas() {
        return ventaRepositorio.findAll();
    }

    @Override
    public Venta buscarVentaPorId(String id) {
        return ventaRepositorio.findById(id).orElse(null);
    }

    @Override
    public Venta guardarVenta(Venta venta) {
        return ventaRepositorio.save(venta);
    }

    @Override
    public void eliminarVenta(String id) {
        ventaRepositorio.deleteById(id);
    }
}