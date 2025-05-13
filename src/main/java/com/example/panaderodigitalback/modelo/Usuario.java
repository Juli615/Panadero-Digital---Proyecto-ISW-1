package com.example.panaderodigitalback.modelo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "usuarios")
public class Usuario {

    @Id
    @Field("_id")
    private String id;

    @Field("nombres")
    private String nombres;

    @Field("apellidos")
    private String apellidos;

    @Field("numero_documento")
    private String numeroDocumento;

    @Field("correo_electronico")
    private String correoElectronico;

    @Field("password")
    private String password;

    @Field("celular")
    private String celular;

    @Field("rol")
    private Rol rol;


    // Enumeración para el rol de usuario
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
    public String getId() {
        return id;
    }

    public void setId(String id) {
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