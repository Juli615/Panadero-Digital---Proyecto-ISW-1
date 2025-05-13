package com.example.panaderodigitalback.modelo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "ventas")
public class Venta {

    @Id
    @Field("_id")
    private String idVenta;

    @Field("usuario_id")
    private String usuarioId; // Referencia al ID del usuario (vendedor)

    @Field("nombres_vendedor")
    private String nombresVendedor; // Dato duplicado para facilitar consultas

    @Field("fecha_venta")
    private LocalDateTime fechaVenta = LocalDateTime.now();

    @Field("monto_total")
    private BigDecimal montoTotal;

    @Field("productos")
    private List<ProductoVendido> productos; // Lista de productos vendidos embebidos

    // Clase interna para representar la información del producto vendido
    public static class ProductoVendido {
        @Field("producto_id")
        private String productoId;

        @Field("nombre")
        private String nombre;

        @Field("precio_unitario")
        private BigDecimal precioUnitario;

        @Field("cantidad")
        private int cantidad;

        @Field("subtotal")
        private BigDecimal subtotal;

        // Constructores, getters y setters para ProductoVendido
        public ProductoVendido() {}

        public ProductoVendido(String productoId, String nombre, BigDecimal precioUnitario, int cantidad, BigDecimal subtotal) {
            this.productoId = productoId;
            this.nombre = nombre;
            this.precioUnitario = precioUnitario;
            this.cantidad = cantidad;
            this.subtotal = subtotal;
        }

        public String getProductoId() {
            return productoId;
        }

        public void setProductoId(String productoId) {
            this.productoId = productoId;
        }

        public String getNombre() {
            return nombre;
        }

        public void setNombre(String nombre) {
            this.nombre = nombre;
        }

        public BigDecimal getPrecioUnitario() {
            return precioUnitario;
        }

        public void setPrecioUnitario(BigDecimal precioUnitario) {
            this.precioUnitario = precioUnitario;
        }

        public int getCantidad() {
            return cantidad;
        }

        public void setCantidad(int cantidad) {
            this.cantidad = cantidad;
        }

        public BigDecimal getSubtotal() {
            return subtotal;
        }

        public void setSubtotal(BigDecimal subtotal) {
            this.subtotal = subtotal;
        }
    }

    //Constructores
    public Venta() {
    }

    public Venta(String usuarioId, String nombresVendedor, LocalDateTime fechaVenta, BigDecimal montoTotal, List<ProductoVendido> productos) {
        this.usuarioId = usuarioId;
        this.nombresVendedor = nombresVendedor;
        this.fechaVenta = fechaVenta;
        this.montoTotal = montoTotal;
        this.productos = productos;
    }

    //Getters y setters
    public String getIdVenta() {
        return idVenta;
    }

    public void setIdVenta(String idVenta) {
        this.idVenta = idVenta;
    }

    public String getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(String usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getNombresVendedor() {
        return nombresVendedor;
    }

    public void setNombresVendedor(String nombresVendedor) {
        this.nombresVendedor = nombresVendedor;
    }

    public LocalDateTime getFechaVenta() {
        return fechaVenta;
    }

    public void setFechaVenta(LocalDateTime fechaVenta) {
        this.fechaVenta = fechaVenta;
    }

    public BigDecimal getMontoTotal() {
        return montoTotal;
    }

    public void setMontoTotal(BigDecimal montoTotal) {
        this.montoTotal = montoTotal;
    }

    public List<ProductoVendido> getProductos() {
        return productos;
    }

    public void setProductos(List<ProductoVendido> productos) {
        this.productos = productos;
    }
}