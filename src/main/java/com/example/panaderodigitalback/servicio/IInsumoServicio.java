package com.example.panaderodigitalback.servicio;

import com.example.panaderodigitalback.modelo.Insumo;

import java.util.List;

public interface IInsumoServicio {

    // Buscar todos los insumos
    List<Insumo> buscarInsumos();

    // Buscar insumo por id
    Insumo buscarInsumoPorId(String idInsumo);

    // Guardar insumo
    Insumo guardarInsumo(Insumo insumo);

    // Eliminar insumo por id
    void eliminarInsumo(String idInsumo);
}
