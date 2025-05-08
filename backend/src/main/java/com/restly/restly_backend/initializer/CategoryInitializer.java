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
                            .imageUrl("https://cloudfront-us-east-1.images.arcpublishing.com/infobae/TBF3OLDXRVFA5CBDDVOJ3HCUYI.jpg")
                            .build(),

                    Category.builder()
                            .name("Resorts")
                            .description("Complejos vacacionales todo incluido con piscinas y entretenimiento")
                            .imageUrl("https://images.adsttc.com/media/images/5f37/1cac/b357/65d2/c900/0089/large_jpg/13-Imagen_Exterior__arquitecturaicomplementos.jpg?1597447331")
                            .build(),

                    Category.builder()
                            .name("Casas de campo")
                            .description("Propiedades exclusivas con privacidad y las afueras de la ciudad")
                            .imageUrl("https://www.myluxoria.com/storage/app/uploads/public/630/77d/1e4/63077d1e4e7a2970728706.jpg")
                            .build(),

                    Category.builder()
                            .name("Apartamentos")
                            .description("Alojamientos independientes con cocina y espacios privados")
                            .imageUrl("https://images.ctfassets.net/8lc7xdlkm4kt/6bYolzLQSPgZawCDlHb9qr/ca35368f17fc3143fe969c9b074a73de/mint-apartamentos-barranquilla-sala.jpg")
                            .build(),

                    Category.builder()
                            .name("Hostales")
                            .description("Alojamiento económico ideal para mochileros")
                            .imageUrl("https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2016/01/21/14534074289552.jpg")
                            .build(),

                    Category.builder()
                            .name("Villas")
                            .description("Propiedades exclusivas con privacidad y lujo")
                            .imageUrl("https://www.myluxoria.com/storage/app/uploads/public/630/77d/1e4/63077d1e4e7a2970728706.jpg")
                            .build()
            );

            categoryRepository.saveAll(categories);
            System.out.println("✅ 5 categorías creadas: Hoteles, Resorts, Apartamentos, Hostales, Villas");
        }
    }
}