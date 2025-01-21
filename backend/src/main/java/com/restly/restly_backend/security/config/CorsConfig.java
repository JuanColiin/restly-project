package com.restly.restly_backend.security.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Aplica CORS a todos los endpoints
                .allowedOriginPatterns("http://localhost:5175") // Origen permitido
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos HTTP permitidos
                .allowedHeaders("*") // Permitir todos los encabezados
                .exposedHeaders("Authorization", "Content-Type") // Exponer headers específicos
                .allowCredentials(true); // Permitir cookies o credenciales
    }
}

