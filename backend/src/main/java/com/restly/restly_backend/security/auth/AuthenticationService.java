package com.restly.restly_backend.security.auth;

import com.restly.restly_backend.security.config.JwtService;
import com.restly.restly_backend.security.entity.Role;
import com.restly.restly_backend.security.entity.User;
import com.restly.restly_backend.security.repository.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        var jwt = jwtService.generateToken(user);

        // Agregar mensaje en la respuesta
        return AuthenticationResponse.builder()
                .token(jwt)
                .message("User registered successfully")
                .userId(user.getId())
                .firstname(user.getFirstname())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }


    public AuthenticationResponse login(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        var jwt = jwtService.generateToken(user);

        // Si el username debe ser el correo electrónico:
        return AuthenticationResponse.builder()
                .token(jwt)
                .message("Login successful")
                .userId(user.getId())
                .firstname(user.getFirstname())
                .username(user.getUsername()) // Aquí username es el correo
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}