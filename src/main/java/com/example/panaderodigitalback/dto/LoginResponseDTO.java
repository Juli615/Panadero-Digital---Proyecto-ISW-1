package com.example.panaderodigitalback.dto;

public class LoginResponseDTO {

    private String token;

    //Constructores
    public LoginResponseDTO() {}

    public LoginResponseDTO(String token) {
        this.token = token;
    }

    //Getters y setters

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
