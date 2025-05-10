package com.example.panaderodigitalback.modelo;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = Insumo.TABLE_NAME)
public class Insumo {

    public static final String TABLE_NAME = "Insumo";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_insumo")
    private Long idInsumo;

    // Relacion uno a muchos con la tabla Producto_Insumo
    @OneToMany(mappedBy = "insumo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductoInsumo> productoInsumos;

    // Relacion uno a muchos con la tabla Detalle_Pedido
    @OneToMany(mappedBy = "insumo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetallePedido> detallesPedido;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "cantidad_disponible")
    private BigDecimal cantidadDisponible;

    @Column(name = "unidad_medida")
    private String unidadMedida;

    @Column(name = "cantidad_medida")
    private BigDecimal cantidadMedida;

    // Constructores
    public Insumo() {
    }

    public Insumo(List<ProductoInsumo> productoInsumos, List<DetallePedido> detallesPedido, String nombre, BigDecimal cantidadDisponible, String unidadMedida, BigDecimal cantidadMedida) {
        this.productoInsumos = productoInsumos;
        this.detallesPedido = detallesPedido;
        this.nombre = nombre;
        this.cantidadDisponible = cantidadDisponible;
        this.unidadMedida = unidadMedida;
        this.cantidadMedida = cantidadMedida;
    }

    // Getters y setters
    public Long getIdInsumo() {
        return idInsumo;
    }

    public void setIdInsumo(Long idInsumo) {
        this.idInsumo = idInsumo;
    }

    public List<ProductoInsumo> getProductoInsumos() {
        return productoInsumos;
    }

    public void setProductoInsumos(List<ProductoInsumo> productoInsumos) {
        this.productoInsumos = productoInsumos;
    }

    public List<DetallePedido> getDetallesPedido() {
        return detallesPedido;
    }

    public void setDetallesPedido(List<DetallePedido> detallesPedido) {
        this.detallesPedido = detallesPedido;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public BigDecimal getCantidadDisponible() {
        return cantidadDisponible;
    }

    public void setCantidadDisponible(BigDecimal cantidadDisponible) {
        this.cantidadDisponible = cantidadDisponible;
    }

    public String getUnidadMedida() {
        return unidadMedida;
    }

    public void setUnidadMedida(String unidadMedida) {
        this.unidadMedida = unidadMedida;
    }

    public BigDecimal getCantidadMedida() {
        return cantidadMedida;
    }

    public void setCantidadMedida(BigDecimal cantidadMedida) {
        this.cantidadMedida = cantidadMedida;
    }
}