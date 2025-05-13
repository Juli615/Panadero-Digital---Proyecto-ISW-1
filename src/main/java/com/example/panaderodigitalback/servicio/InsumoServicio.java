package com.example.panaderodigitalback.servicio;

import com.example.panaderodigitalback.modelo.Insumo;
import com.example.panaderodigitalback.repositorio.InsumoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InsumoServicio implements IInsumoServicio {

    @Autowired
    private InsumoRepositorio insumoRepositorio;

    @Override
    public List<Insumo> buscarInsumos() {
        return insumoRepositorio.findAll();
    }

    @Override
    public Insumo buscarInsumoPorId(String idInsumo) {
        return insumoRepositorio.findById(idInsumo).orElse(null);
    }

    @Override
    public Insumo guardarInsumo(Insumo insumo) {
        return insumoRepositorio.save(insumo);
    }

    @Override
    public void eliminarInsumo(String idInsumo) {
        insumoRepositorio.deleteById(idInsumo);
    }
}
