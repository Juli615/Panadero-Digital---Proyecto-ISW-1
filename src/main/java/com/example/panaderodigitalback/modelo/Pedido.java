package com.example.panaderodigitalback.modelo;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = Pedido.TABLE_NAME)
public class Pedido {

    public static final String TABLE_NAME = "Pedido";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido")
    private Long idPedido;

    // Relacion muchos a uno con la tabla Usuario
    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    // Relacion muchos a uno con la tabla proveedor
    @ManyToOne
    @JoinColumn(name = "id_proveedor")
    private Proveedor proveedor;

    // Relacion uno a muchos con la tabla Detalle_Pedido
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetallePedido> detallesPedido;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_pedido")
    private EstadoPedido estadoPedido;

    // Enumeración para el estado del pedido
    public enum EstadoPedido {
        pendiente, procesado, entregado,cancelado
    }

    @Column(name = "fecha_entrega")
    private LocalDate fechaEntrega;

    // Constructores
    public Pedido() {
    }

    public Pedido(Usuario usuario, Proveedor proveedor, List<DetallePedido> detallesPedido, EstadoPedido estadoPedido, LocalDate fechaEntrega) {
        this.usuario = usuario;
        this.proveedor = proveedor;
        this.detallesPedido = detallesPedido;
        this.estadoPedido = estadoPedido;
        this.fechaEntrega = fechaEntrega;
    }

    // Getters y setters
    public Long getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(Long idPedido) {
        this.idPedido = idPedido;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Proveedor getProveedor() {
        return proveedor;
    }

    public void setProveedor(Proveedor proveedor) {
        this.proveedor = proveedor;
    }

    public List<DetallePedido> getDetallesPedido() {
        return detallesPedido;
    }

    public void setDetallesPedido(List<DetallePedido> detallesPedido) {
        this.detallesPedido = detallesPedido;
    }

    public EstadoPedido getEstadoPedido() {
        return estadoPedido;
    }

    public void setEstadoPedido(EstadoPedido estadoPedido) {
        this.estadoPedido = estadoPedido;
    }

    public LocalDate getFechaEntrega() {
        return fechaEntrega;
    }

    public void setFechaEntrega(LocalDate fechaEntrega) {
        this.fechaEntrega = fechaEntrega;
    }
}