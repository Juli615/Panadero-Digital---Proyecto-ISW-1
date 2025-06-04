package com.example.panaderodigitalback.controlador;

import com.example.panaderodigitalback.modelo.Usuario;
import com.example.panaderodigitalback.servicio.UsuarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:3000", 
             allowedHeaders = "*", 
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, 
                       RequestMethod.DELETE, RequestMethod.OPTIONS},
             allowCredentials = "true")
public class UsuarioController {

    @Autowired
    private UsuarioServicio usuarioServicio;

    // Buscar todos los usuarios
    @GetMapping("/list")
    public List<Usuario> buscarUsuarios() {
        return usuarioServicio.buscarUsuarios();
    }

    // Buscar usuario por id
    @GetMapping("/list/{id}")
    public Usuario buscarUsuarioPorId(@PathVariable("id") String id) {
        return usuarioServicio.buscarUsuarioPorId(id);
    }

    // Agregar un usuario
    // Los datos se pasan en el cuerpo de la peticion
    @PostMapping("/agregar")
    public ResponseEntity<Usuario> agregarUsuario(@RequestBody Usuario usuario) {
        // Validar que el rol sea vendedor o proveedor
        if (usuario.getRol() != Usuario.Rol.vendedor && usuario.getRol() != Usuario.Rol.proveedor) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Validar que el correo electrónico no esté ya registrado
        if (usuarioServicio.existeCorreoElectronico(usuario.getCorreoElectronico())) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        Usuario nuevoUsuario = usuarioServicio.guardarUsuario(usuario);
        return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
    }

    // Editar un usuario
    // El id se pasa en el cuerpo de la peticion
    @PutMapping("/editar")
    public ResponseEntity<Usuario> editarUsuario(@RequestBody Usuario usuario) {
        String id = usuario.getId();
        if(id == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Usuario usuarioExistente = usuarioServicio.buscarUsuarioPorId(id);
        if(usuarioExistente != null) {
            Usuario usuarioActualizado = usuarioServicio.guardarUsuario(usuario);
            return new ResponseEntity<>(usuarioActualizado, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Eliminar un usuario por id
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Usuario> eliminarUsuario(@PathVariable("id") String id) {
        Usuario usuarioExistente = usuarioServicio.buscarUsuarioPorId(id);
        if(usuarioExistente != null) {
            usuarioServicio.eliminarUsuario(id);
            return new ResponseEntity<>(usuarioExistente, HttpStatus.NO_CONTENT);
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}