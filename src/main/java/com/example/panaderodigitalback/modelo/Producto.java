package com.example.panaderodigitalback.modelo;

import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = Producto.TABLE_NAME)
public class Producto {

    public static final String TABLE_NAME = "Producto";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Long idProducto;

    // Relacion uno a muchos con la tabla Producto_Insumo
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductoInsumo> productoInsumos;

    // Relacion uno a muchos con la tabla Detalle_Venta
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleVenta> detallesVenta;

    @Column(name = "nombre", length = 100)
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "precio")
    private BigDecimal precio;

    @Column(name = "categoria", length = 100)
    private String categoria;

    @Column(name = "stock")
    private int stock;

    @Column(name = "disponible")
    private boolean disponible;

    // Constructores
    public Producto() {}

    public Producto(List<ProductoInsumo> productoInsumos, List<DetalleVenta> detallesVenta, String nombre, String descripcion, BigDecimal precio, String categoria, int stock, boolean disponible) {
        this.productoInsumos = productoInsumos;
        this.detallesVenta = detallesVenta;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.categoria = categoria;
        this.stock = stock;
        this.disponible = disponible;
    }

    // Getters y setters
    public Long getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Long idProducto) {
        this.idProducto = idProducto;
    }

    public List<ProductoInsumo> getProductoInsumos() {
        return productoInsumos;
    }

    public void setProductoInsumos(List<ProductoInsumo> productoInsumos) {
        this.productoInsumos = productoInsumos;
    }

    public List<DetalleVenta> getDetallesVenta() {
        return detallesVenta;
    }

    public void setDetallesVenta(List<DetalleVenta> detallesVenta) {
        this.detallesVenta = detallesVenta;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public boolean isDisponible() {
        return disponible;
    }

    public void setDisponible(boolean disponible) {
        this.disponible = disponible;
    }
}