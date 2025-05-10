package com.example.panaderodigitalback.modelo;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = DetalleVenta.TABLE_NAME)
public class DetalleVenta {

    public static final String TABLE_NAME = "Detalle_Venta";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle_venta")
    private Long idDetalleVenta;

    //Relacion muchos a uno con la tabla Venta
    @ManyToOne
    @JoinColumn(name = "id_venta")
    private Venta venta;

    // Relacion muchos a uno con la tabla Producto
    @ManyToOne
    @JoinColumn(name = "id_producto")
    private Producto producto;

    @Column(name = "cantidad")
    private int cantidad;

    @Column(name = "subtotal")
    private BigDecimal subtotal;

    //Constructores
    public DetalleVenta() {
    }

    public DetalleVenta(Venta venta, Producto producto, int cantidad, BigDecimal subtotal) {
        this.venta = venta;
        this.producto = producto;
        this.cantidad = cantidad;
        this.subtotal = subtotal;
    }

    //Getters y setters
    public Long getIdDetalleVenta() {
        return idDetalleVenta;
    }

    public void setIdDetalleVenta(Long idDetalleVenta) {
        this.idDetalleVenta = idDetalleVenta;
    }

    public Venta getVenta() {
        return venta;
    }

    public void setVenta(Venta venta) {
        this.venta = venta;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
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