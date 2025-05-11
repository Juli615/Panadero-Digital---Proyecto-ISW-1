package com.example.panaderodigitalback.repositorio;

import com.example.panaderodigitalback.modelo.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProveedorRepositorio extends JpaRepository<Proveedor, Long> {
    @Modifying
    @Query("DELETE FROM Proveedor p WHERE p.idUsuario = :id")
    void eliminarProveedorPorId(@Param("id") Long id);
}
