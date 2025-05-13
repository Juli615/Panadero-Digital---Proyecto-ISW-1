package com.example.panaderodigitalback.modelo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.util.List;

@Document(collection = "productos")
public class Producto {

    @Id
    @Field("_id")
    private String idProducto;

    @Field("nombre")
    private String nombre;

    @Field("descripcion")
    private String descripcion;

    @Field("precio")
    private BigDecimal precio;

    @Field("categoria")
    private String categoria;

    @Field("stock")
    private int stock;

    @Field("disponible")
    private boolean disponible;

    @Field("insumos")
    private List<InsumoInfo> insumos; // Lista de insumos embebidos

    // Clase interna para representar la información del insumo embebido
    public static class InsumoInfo {
        @Field("insumo_id")
        private String insumoId;

        @Field("nombre")
        private String nombre;

        @Field("cantidad_usada")
        private Double cantidadUsada;

        // Constructores, getters y setters para InsumoInfo
        public InsumoInfo() {}

        public InsumoInfo(String insumoId, String nombre, Double cantidadUsada) {
            this.insumoId = insumoId;
            this.nombre = nombre;
            this.cantidadUsada = cantidadUsada;
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

        public Double getCantidadUsada() {
            return cantidadUsada;
        }

        public void setCantidadUsada(Double cantidadUsada) {
            this.cantidadUsada = cantidadUsada;
        }
    }

    // Constructores
    public Producto() {}

    public Producto(String nombre, String descripcion, BigDecimal precio, String categoria, int stock, boolean disponible, List<InsumoInfo> insumos) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.categoria = categoria;
        this.stock = stock;
        this.disponible = disponible;
        this.insumos = insumos;
    }

    // Getters y setters
    public String getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(String idProducto) {
        this.idProducto = idProducto;
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

    public List<InsumoInfo> getInsumos() {
        return insumos;
    }

    public void setInsumos(List<InsumoInfo> insumos) {
        this.insumos = insumos;
    }
}