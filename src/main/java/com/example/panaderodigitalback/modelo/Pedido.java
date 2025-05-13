package com.example.panaderodigitalback.modelo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "pedidos")
public class Pedido {

    @Id
    @Field("_id")
    private String idPedido;

    @Field("usuario_id")
    private String usuarioId; // Referencia al ID del usuario que realizó el pedido

    @Field("proveedor_id")
    private String proveedorId; // Referencia al ID del proveedor

    @Field("nombre_proveedor")
    private String nombreProveedor; // Dato duplicado para facilitar consultas

    @Field("estado_pedido")
    private EstadoPedido estadoPedido;

    public enum EstadoPedido {
        pendiente, procesado, entregado, cancelado
    }

    @Field("fecha_entrega")
    private LocalDate fechaEntrega;

    @Field("fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Field("insumos")
    private List<InsumoPedido> insumos; // Lista de insumos pedidos embebidos

    @Field("monto_total")
    private BigDecimal montoTotal;

    // Clase interna para representar la información del insumo pedido
    public static class InsumoPedido {
        @Field("insumo_id")
        private String insumoId;

        @Field("nombre")
        private String nombre; // Duplicado para facilitar consultas

        @Field("cantidad_pedida")
        private Double cantidadPedida;

        @Field("subtotal")
        private BigDecimal subtotal;

        // Constructores, getters y setters para InsumoPedido
        public InsumoPedido() {}

        public InsumoPedido(String insumoId, String nombre, Double cantidadPedida, BigDecimal subtotal) {
            this.insumoId = insumoId;
            this.nombre = nombre;
            this.cantidadPedida = cantidadPedida;
            this.subtotal = subtotal;
        }

        public String getInsumoId() {
            return insumoId;
        }

        public void setInsumoId(String insumoId) {
            this.insumoId = insumoId;
        }

        public String getNombre() {
            return nombre;
        }

        public void setNombre(String nombre) {
            this.nombre = nombre;
        }

        public Double getCantidadPedida() {
            return cantidadPedida;
        }

        public void setCantidadPedida(Double cantidadPedida) {
            this.cantidadPedida = cantidadPedida;
        }

        public BigDecimal getSubtotal() {
            return subtotal;
        }

        public void setSubtotal(BigDecimal subtotal) {
            this.subtotal = subtotal;
        }
    }

    // Constructores
    public Pedido() {
    }

    public Pedido(String usuarioId, String proveedorId, String nombreProveedor, EstadoPedido estadoPedido, LocalDate fechaEntrega, LocalDateTime fechaCreacion, List<InsumoPedido> insumos, BigDecimal montoTotal) {
        this.usuarioId = usuarioId;
        this.proveedorId = proveedorId;
        this.nombreProveedor = nombreProveedor;
        this.estadoPedido = estadoPedido;
        this.fechaEntrega = fechaEntrega;
        this.fechaCreacion = fechaCreacion;
        this.insumos = insumos;
        this.montoTotal = montoTotal;
    }

    // Getters y setters
    public String getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(String idPedido) {
        this.idPedido = idPedido;
    }

    public String getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(String usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getProveedorId() {
        return proveedorId;
    }

    public void setProveedorId(String proveedorId) {
        this.proveedorId = proveedorId;
    }

    public String getNombreProveedor() {
        return nombreProveedor;
    }

    public void setNombreProveedor(String nombreProveedor) {
        this.nombreProveedor = nombreProveedor;
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

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public List<InsumoPedido> getInsumos() {
        return insumos;
    }

    public void setInsumos(List<InsumoPedido> insumos) {
        this.insumos = insumos;
    }

    public BigDecimal getMontoTotal() {
        return montoTotal;
    }

    public void setMontoTotal(BigDecimal montoTotal) {
        this.montoTotal = montoTotal;
    }
}