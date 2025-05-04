package com.example.panaderodigitalback.modelo;

import jakarta.persistence.*;

@Entity
@Table(name = Proveedor.TABLE_NAME)
public class Proveedor {

    public static final String TABLE_NAME = "Proveedor";

    @Id
    @Column(name = "id_usuario")
    private Long idUsuario;

    //Relacion uno a uno con la tabla Usuario
    @OneToOne
    @MapsId
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @Column(name = "nombre_empresa", length = 150)
    private String nombreEmpresa;

    @Column(name = "correo_electronico", length = 100)
    private String correoElectronico;

    @Column(name = "nit", length = 50)
    private String nit;

    @Column(name = "telefono", length = 20)
    private String telefono;

    @Column(name = "direccion", length = 200)
    private String direccion;

    // Constructores
    public Proveedor() {
    }

    public Proveedor(Usuario usuario, String nombreEmpresa, String correoElectronico, String nit, String telefono, String direccion) {
        this.usuario = usuario;
        this.nombreEmpresa = nombreEmpresa;
        this.correoElectronico = correoElectronico;
        this.nit = nit;
        this.telefono = telefono;
        this.direccion = direccion;
    }

    // Getters y setters
    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getNombreEmpresa() {
        return nombreEmpresa;
    }

    public void setNombreEmpresa(String nombreEmpresa) {
        this.nombreEmpresa = nombreEmpresa;
    }

    public String getCorreoElectronico() {
        return correoElectronico;
    }

    public void setCorreoElectronico(String correoElectronico) {
        this.correoElectronico = correoElectronico;
    }

    public String getNit() {
        return nit;
    }

    public void setNit(String nit) {
        this.nit = nit;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
}
