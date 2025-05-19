package com.example.panaderodigitalback.modelo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;

@Document(collection = "insumos")
public class Insumo {

    @Id
    private String idInsumo;

    @Field("nombre")
    private String nombre;

    @Field("cantidad_disponible")
    private BigDecimal cantidadDisponible;

    @Field("unidad_medida")
    private String unidadMedida;

    @Field("cantidad_medida")
    private BigDecimal cantidadMedida;

    // Constructores
    public Insumo() {
    }

    public Insumo(String nombre, BigDecimal cantidadDisponible, String unidadMedida, BigDecimal cantidadMedida) {
        this.nombre = nombre;
        this.cantidadDisponible = cantidadDisponible;
        this.unidadMedida = unidadMedida;
        this.cantidadMedida = cantidadMedida;
    }

    // Getters y setters
    public String getIdInsumo() {
        return idInsumo;
    }

    public void setIdInsumo(String idInsumo) {
        this.idInsumo = idInsumo;
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