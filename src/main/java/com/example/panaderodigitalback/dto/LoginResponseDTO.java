package com.example.panaderodigitalback.dto;

public class LoginResponseDTO {

    private String token;
    private String id;
    private String nombres;
    private String apellidos;
    private String correo;
    private String rol;

    //Constructores
    public LoginResponseDTO() {}

    public LoginResponseDTO(String token, String id, String nombres, String apellidos, String correo, String rol) {
        this.token = token;
        this.id = id;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.correo = correo;
        this.rol = rol;
    }

    //Getters y setters

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

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

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}
