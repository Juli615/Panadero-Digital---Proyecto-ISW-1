package com.example.panaderodigitalback.servicio;

import com.example.panaderodigitalback.modelo.Venta;

import java.util.List;

public interface IVentaServicio {

    // Buscar todas las ventas
    List<Venta> buscarVentas();

    // Buscar venta por id
    Venta buscarVentaPorId(String id);

    // Guardar venta
    Venta guardarVenta(Venta venta);

    // Elminar una venta por id
    void eliminarVenta(String id);
}
