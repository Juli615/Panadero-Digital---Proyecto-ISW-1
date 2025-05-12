package com.example.panaderodigitalback.modelo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = Proveedor.TABLE_NAME)
public class Proveedor {

    public static final String TABLE_NAME = "Proveedor";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Genera su propio ID
    @Column(name = "id_proveedor")
    private Long idProveedor;

    @ManyToOne // Muchos Proveedores pueden estar asociados a un Usuario
    @JoinColumn(name = "id_usuario") // Clave foránea
    private Usuario usuario;

    @OneToMany(mappedBy = "proveedor", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Pedido> pedidos;

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

    // Constructores, Getters y Setters
    public Proveedor() {
    }

    public Proveedor(Usuario usuario, List<Pedido> pedidos, String nombreEmpresa, String correoElectronico, String nit, String telefono, String direccion) {
        this.usuario = usuario;
        this.pedidos = pedidos;
        this.nombreEmpresa = nombreEmpresa;
        this.correoElectronico = correoElectronico;
        this.nit = nit;
        this.telefono = telefono;
        this.direccion = direccion;
    }

    public Long getIdProveedor() {
        return idProveedor;
    }

    public void setIdProveedor(Long idProveedor) {
        this.idProveedor = idProveedor;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public List<Pedido> getPedidos() {
        return pedidos;
    }

    public void setPedidos(List<Pedido> pedidos) {
        this.pedidos = pedidos;
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