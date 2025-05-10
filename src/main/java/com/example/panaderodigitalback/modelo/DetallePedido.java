package com.example.panaderodigitalback.modelo;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = DetallePedido.TABLE_NAME)
public class DetallePedido {

    public static final String TABLE_NAME = "Detalle_Pedido";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle_pedido")
    private Long idDetallePedido;

    // Relacion muchos a uno con la tabla Pedido
    @ManyToOne
    @JoinColumn(name = "id_pedido")
    private Pedido pedido;

    // Relacion muchos a uno con la tabla insumo
    @ManyToOne
    @JoinColumn(name = "id_insumo")
    private Insumo insumo;

    @Column(name = "cantidad_pedida")
    private BigDecimal cantidadPedida;

    @Column(name = "subtotal")
    private BigDecimal subtotal;

    // Constructores
    public DetallePedido() {
    }

    public DetallePedido(Pedido pedido, Insumo insumo, BigDecimal cantidadPedida, BigDecimal subtotal) {
        this.pedido = pedido;
        this.insumo = insumo;
        this.cantidadPedida = cantidadPedida;
        this.subtotal = subtotal;
    }

    // Getters y setters
    public Long getIdDetallePedido() {
        return idDetallePedido;
    }

    public void setIdDetallePedido(Long idDetallePedido) {
        this.idDetallePedido = idDetallePedido;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    public Insumo getInsumo() {
        return insumo;
    }

    public void setInsumo(Insumo insumo) {
        this.insumo = insumo;
    }

    public BigDecimal getCantidadPedida() {
        return cantidadPedida;
    }

    public void setCantidadPedida(BigDecimal cantidadPedida) {
        this.cantidadPedida = cantidadPedida;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}