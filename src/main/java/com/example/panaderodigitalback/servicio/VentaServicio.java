package com.example.panaderodigitalback.servicio;

import com.example.panaderodigitalback.modelo.Venta;
import com.example.panaderodigitalback.modelo.Producto;
import com.example.panaderodigitalback.modelo.Insumo;
import com.example.panaderodigitalback.repositorio.VentaRepositorio;
import com.example.panaderodigitalback.repositorio.ProductoRepositorio;
import com.example.panaderodigitalback.repositorio.InsumoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class VentaServicio implements IVentaServicio {

    @Autowired
    private VentaRepositorio ventaRepositorio;

    @Autowired
    private ProductoRepositorio productoRepositorio;

    @Autowired
    private InsumoRepositorio insumoRepositorio;

    @Override
    public List<Venta> buscarVentas() {
        return ventaRepositorio.findAll();
    }

    @Override
    public Venta buscarVentaPorId(String id) {
        return ventaRepositorio.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public Venta guardarVenta(Venta venta) {
        try {
            // Por cada producto vendido
            for (Venta.ProductoVendido productoVendido : venta.getProductos()) {
                // Buscar el producto
                Producto producto = productoRepositorio.findById(productoVendido.getProductoId())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + productoVendido.getProductoId()));

                // Por cada insumo del producto
                for (Producto.InsumoInfo insumoInfo : producto.getInsumos()) {
                    // Buscar el insumo
                    Insumo insumo = insumoRepositorio.findById(insumoInfo.getInsumoId())
                            .orElseThrow(() -> new RuntimeException("Insumo no encontrado: " + insumoInfo.getInsumoId()));

                    // Calcular cantidad a descontar
                    double cantidadADescontar = insumoInfo.getCantidadUsada() * productoVendido.getCantidad();
                    BigDecimal nuevaCantidad = insumo.getCantidadDisponible()
                            .subtract(BigDecimal.valueOf(cantidadADescontar));

                    // Verificar si hay suficiente cantidad
                    if (nuevaCantidad.compareTo(BigDecimal.ZERO) < 0) {
                        throw new RuntimeException("No hay suficiente cantidad del insumo: " + insumo.getNombre());
                    }

                    // Actualizar cantidad
                    insumo.setCantidadDisponible(nuevaCantidad);
                    insumoRepositorio.save(insumo);
                }
            }

            // Guardar la venta
            return ventaRepositorio.save(venta);
        } catch (Exception e) {
            throw new RuntimeException("Error al procesar la venta: " + e.getMessage());
        }
    }

    @Override
    public void eliminarVenta(String id) {
        ventaRepositorio.deleteById(id);
    }
}