package com.restly.restly_backend.security.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configure(http))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        // Endpoints protegidos primero
                        // Productos
                        .requestMatchers(HttpMethod.POST, "/products/create").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/products/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/products/{id}").hasRole("ADMIN")
                        // Categorías
                        .requestMatchers(HttpMethod.POST, "/categories").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/categories/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/categories/{id}").hasRole("ADMIN")
                        //features
                        .requestMatchers(HttpMethod.POST, "/features").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/features/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/features/{id}").hasRole("ADMIN")
                        //user
                        .requestMatchers(HttpMethod.PUT, "/users/update-role/{userId}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/users/{id}").hasAnyRole("ADMIN", "USER")
                        .requestMatchers("/favorites/**").authenticated()
                        //reserves
                        .requestMatchers(HttpMethod.POST, "/reserves").authenticated()
                        .requestMatchers(HttpMethod.GET, "/reserves/product/{productId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/reserves/user/{userId}").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/reserves/{id}").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/reserves/{id}/extend").authenticated()
                        //reviews
                        .requestMatchers(HttpMethod.POST, "/reviews").authenticated()
                        .requestMatchers(HttpMethod.GET, "/reviews/product/{productId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/reviews/user/{userId}").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/reviews/{id}").authenticated()
                        // Swagger
                        .requestMatchers(HttpMethod.GET, "/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                        // Reglas generales después
                        .requestMatchers("/products/**").permitAll()
                        .requestMatchers("/categories/**").permitAll()
                        .requestMatchers("/cities/**").permitAll()
                        .requestMatchers("/features/**").permitAll()
                        .requestMatchers("/reserves/**").permitAll()
                        .requestMatchers("/reviews/**").permitAll()
                        .requestMatchers("/test-email/**").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}