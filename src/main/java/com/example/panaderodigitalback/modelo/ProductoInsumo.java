package com.example.panaderodigitalback.modelo;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = ProductoInsumo.TABLE_NAME)
public class ProductoInsumo {

    public static final String TABLE_NAME = "Producto_Insumo";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto_insumo")
    private Long idProductoInsumo;

    // Relacion muchos a uno con la tabla Producto
    @ManyToOne
    @JoinColumn(name = "id_producto")
    private Producto producto;

    // Relacion muchos a uno con la tabla Insumo
    @ManyToOne
    @JoinColumn(name = "id_insumo")
    private Insumo insumo;

    @Column(name = "cantidad_usada")
    private BigDecimal cantidadUsada;

    // Constructores
    public ProductoInsumo() {
    }

    public ProductoInsumo(Producto producto, Insumo insumo, BigDecimal cantidadUsada) {
        this.producto = producto;
        this.insumo = insumo;
        this.cantidadUsada = cantidadUsada;
    }

    // Getters y setters
    public Long getIdProductoInsumo() {
        return idProductoInsumo;
    }

    public void setIdProductoInsumo(Long idProductoInsumo) {
        this.idProductoInsumo = idProductoInsumo;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public Insumo getInsumo() {
        return insumo;
    }

    public void setInsumo(Insumo insumo) {
        this.insumo = insumo;
    }

    public BigDecimal getCantidadUsada() {
        return cantidadUsada;
    }

    public void setCantidadUsada(BigDecimal cantidadUsada) {
        this.cantidadUsada = cantidadUsada;
    }
}
