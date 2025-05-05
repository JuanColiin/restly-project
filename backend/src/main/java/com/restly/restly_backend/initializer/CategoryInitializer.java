package com.restly.restly_backend.initializer;

import com.restly.restly_backend.category.entity.Category;
import com.restly.restly_backend.category.repository.ICategoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Order(1)
@RequiredArgsConstructor
public class CategoryInitializer implements CommandLineRunner {

    private final ICategoryRepository categoryRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            List<Category> categories = List.of(
                    Category.builder()
                            .name("Hoteles")
                            .description("Alojamientos con servicio completo y amenities")
                            .imageUrl("https://ejemplo.com/hoteles.jpg")
                            .build(),

                    Category.builder()
                            .name("Resorts")
                            .description("Complejos vacacionales todo incluido con piscinas y entretenimiento")
                            .imageUrl("https://ejemplo.com/resorts.jpg")
                            .build(),

                    Category.builder()
                            .name("Apartamentos")
                            .description("Alojamientos independientes con cocina y espacios privados")
                            .imageUrl("https://ejemplo.com/apartamentos.jpg")
                            .build(),

                    Category.builder()
                            .name("Hostales")
                            .description("Alojamiento económico ideal para mochileros")
                            .imageUrl("https://ejemplo.com/hostales.jpg")
                            .build(),

                    Category.builder()
                            .name("Villas")
                            .description("Propiedades exclusivas con privacidad y lujo")
                            .imageUrl("https://ejemplo.com/villas.jpg")
                            .build()
            );

            categoryRepository.saveAll(categories);
            System.out.println("✅ 5 categorías creadas: Hoteles, Resorts, Apartamentos, Hostales, Villas");
        }
    }
}