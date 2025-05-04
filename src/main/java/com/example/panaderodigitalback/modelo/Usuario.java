package com.example.panaderodigitalback.modelo;

import jakarta.persistence.*;

@Entity
@Table(name = Usuario.TABLE_NAME)
public class Usuario {

    public static final String TABLE_NAME = "Usuario";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    @Column(name = "nombres", length = 100)
    private String nombres;

    @Column(name = "apellidos", length = 100)
    private String apellidos;

    @Column(name = "numero_documento", length = 50)
    private String numeroDocumento;

    @Column(name = "correo_electronico", length = 100)
    private String correoElectronico;

    @Column(name = "password", length = 255)
    private String password;

    @Column(name = "celular", length = 20)
    private String celular;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol")
    private Rol rol;

    //Enumeración para el rol de usuario
    public enum Rol {
        admin, vendedor, proveedor
    }

    // Constructores
    public Usuario() {}

    public Usuario(String nombres, String apellidos, String numeroDocumento, String correoElectronico, String password, String celular, Rol rol) {
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.numeroDocumento = numeroDocumento;
        this.correoElectronico = correoElectronico;
        this.password = password;
        this.celular = celular;
        this.rol = rol;
    }

    // Getters y setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getNumeroDocumento() {
        return numeroDocumento;
    }

    public void setNumeroDocumento(String numeroDocumento) {
        this.numeroDocumento = numeroDocumento;
    }

    public String getCorreoElectronico() {
        return correoElectronico;
    }

    public void setCorreoElectronico(String correoElectronico) {
        this.correoElectronico = correoElectronico;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCelular() {
        return celular;
    }

    public void setCelular(String celular) {
        this.celular = celular;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }
}
