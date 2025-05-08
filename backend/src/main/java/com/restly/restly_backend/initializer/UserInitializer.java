package com.restly.restly_backend.initializer;

import com.restly.restly_backend.security.entity.Role;
import com.restly.restly_backend.security.entity.User;
import com.restly.restly_backend.security.repository.IUserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Order(4)
@RequiredArgsConstructor
public class UserInitializer implements CommandLineRunner {

    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        String adminEmail = "admin@restly.com";
        String userEmail = "user@restly.com";

        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = User.builder()
                    .firstname("Admin")
                    .lastname("Sistema")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("Admin1234"))
                    .role(Role.ROLE_ADMIN)
                    .build();

            userRepository.save(admin);
            System.out.println("""
                \n
                ***********************************************
                USUARIO ADMIN CREADO EXITOSAMENTE
                Email: admin@restly.com
                Contraseña: Admin1234
                Rol: ADMIN
                ***********************************************
                """);

            User user1 = User.builder()
                    .firstname("Usuario")
                    .lastname("Prueba")
                    .email(userEmail)
                    .password(passwordEncoder.encode("User1234"))
                    .role(Role.ROLE_USER)
                    .build();

            userRepository.save(user1);
            System.out.println("""
                \n
                ***********************************************
                USUARIO CON ROL USER CREADO EXITOSAMENTE
                Email: user@restly.com
                Contraseña: User1234
                Rol: USER
                ***********************************************
                """);

        }
    }
}