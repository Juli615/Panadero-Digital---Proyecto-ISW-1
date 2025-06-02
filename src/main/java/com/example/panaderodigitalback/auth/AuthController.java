package com.example.panaderodigitalback.auth;

import com.example.panaderodigitalback.dto.LoginRequestDTO;
import com.example.panaderodigitalback.dto.LoginResponseDTO;
import com.example.panaderodigitalback.modelo.Usuario;
import com.example.panaderodigitalback.repositorio.UsuarioRepositorio;
import com.example.panaderodigitalback.security.jwt.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", 
             allowedHeaders = "*", 
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, 
                       RequestMethod.DELETE, RequestMethod.OPTIONS},
             allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getCorreo(), loginRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getCorreo());
            String token = jwtUtil.generateToken(userDetails);

            // Obtener datos del usuario
            Usuario usuario = usuarioRepositorio.findByCorreoElectronico(loginRequest.getCorreo())
                    .orElseThrow(() -> new Exception("Usuario no encontrado"));

            return ResponseEntity.ok(new LoginResponseDTO(
                token,
                usuario.getId(),
                usuario.getNombres(),
                usuario.getApellidos(),
                usuario.getCorreoElectronico(),
                usuario.getRol().name()
            ));

        } catch (Exception e) {
            System.err.println("Error en la autenticación: " + e.getMessage());
            return new ResponseEntity<>("Error en las credenciales", HttpStatus.UNAUTHORIZED);
        }
    }
}