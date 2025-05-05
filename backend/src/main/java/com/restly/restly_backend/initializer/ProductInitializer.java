package com.restly.restly_backend.initializer;

import com.restly.restly_backend.category.entity.Category;
import com.restly.restly_backend.category.repository.ICategoryRepository;
import com.restly.restly_backend.feature.entity.Feature;
import com.restly.restly_backend.feature.repository.IFeatureRepository;
import com.restly.restly_backend.image.entity.Image;
import com.restly.restly_backend.locations.address.entity.Address;
import com.restly.restly_backend.locations.city.entity.City;
import com.restly.restly_backend.locations.city.repository.ICityRepository;
import com.restly.restly_backend.locations.country.entity.Country;
import com.restly.restly_backend.locations.country.repository.ICountryRepository;
import com.restly.restly_backend.locations.state.entity.State;
import com.restly.restly_backend.locations.state.repository.IStateRepository;
import com.restly.restly_backend.policies.entity.Policy;
import com.restly.restly_backend.product.entity.Product;
import com.restly.restly_backend.product.repository.IProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@Order(3)
@RequiredArgsConstructor
public class ProductInitializer implements CommandLineRunner {

    private final IProductRepository productRepository;
    private final ICategoryRepository categoryRepository;
    private final IFeatureRepository featureRepository;
    private final ICountryRepository countryRepository;
    private final IStateRepository stateRepository;
    private final ICityRepository cityRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (productRepository.count() == 0) {
            if (!checkDependencies()) {
                System.out.println("⚠️ Ejecuta primero CategoryInitializer y FeatureInitializer");
                return;
            }

            Country colombia = configureColombiaLocations();
            createColombianProducts(colombia);

            System.out.println("✅ Productos creados con políticas personalizadas");
        }
    }

    private boolean checkDependencies() {
        return categoryRepository.count() >= 5 && featureRepository.count() >= 8;
    }

    private Country configureColombiaLocations() {
        Country colombia = countryRepository.findByName("Colombia")
                .orElseGet(() -> countryRepository.save(
                        Country.builder().name("Colombia").build()));

        Map<String, State> states = Map.of(
                "Bogotá D.C.", createState("Bogotá D.C.", colombia),
                "Antioquia", createState("Antioquia", colombia),
                "Bolívar", createState("Bolívar", colombia),
                "Magdalena", createState("Magdalena", colombia)
        );

        Map<String, City> cities = Map.of(
                "Bogotá", createCity("Bogotá", states.get("Bogotá D.C.")),
                "Medellín", createCity("Medellín", states.get("Antioquia")),
                "Cartagena", createCity("Cartagena", states.get("Bolívar")),
                "Santa Marta", createCity("Santa Marta", states.get("Magdalena"))
        );

        return colombia;
    }

    private State createState(String name, Country country) {
        return stateRepository.findByNameAndCountry(name, country)
                .orElseGet(() -> stateRepository.save(
                        State.builder().name(name).country(country).build()));
    }

    private City createCity(String name, State state) {
        return cityRepository.findByNameAndState(name, state)
                .orElseGet(() -> cityRepository.save(
                        City.builder().name(name).state(state).build()));
    }

    private void createColombianProducts(Country country) {
        Map<String, Category> categories = categoryRepository.findAll().stream()
                .collect(Collectors.toMap(Category::getName, Function.identity()));

        Map<String, Feature> features = featureRepository.findAll().stream()
                .collect(Collectors.toMap(Feature::getTitle, Function.identity()));

        List<ProductDefinition> products = List.of(
                // Hotel Tequendama (Política flexible)
                new ProductDefinition(
                        "Hotel Tequendama Bogotá",
                        "Iconico hotel en el centro de Bogotá",
                        "Hotel 5 estrellas en el corazón de la capital",
                        "Bogotá",
                        "Bogotá D.C.",
                        "Carrera 10 #26-21",
                        "+5713820300",
                        4.8,
                        categories.get("Hoteles"),
                        new PolicyDefinition(
                                "Check-in: 2:00 PM | Check-out: 12:00 PM",
                                "Depósito del 20% al reservar",
                                "Cancelación gratis hasta 48h antes. Luego 1 noche de penalidad"
                        ),
                        List.of("Wi-Fi", "Aire Acondicionado", "Gimnasio"),
                        List.of("https://ejemplo.com/tequendama1.jpg", "https://ejemplo.com/tequendama2.jpg")
                ),

                // Hotel Charlee (Política estricta)
                new ProductDefinition(
                        "Hotel Charlee Medellín",
                        "Boutique hotel en El Poblado",
                        "Diseño vanguardista y exclusivo",
                        "Medellín",
                        "Antioquia",
                        "Calle 9A #37-07",
                        "+5744442484",
                        4.9,
                        categories.get("Hoteles"),
                        new PolicyDefinition(
                                "Check-in: 3:00 PM | Check-out: 11:00 AM",
                                "Depósito del 30% no reembolsable",
                                "Cancelación 7 días antes. Luego 100% de penalidad"
                        ),
                        List.of("Wi-Fi", "Piscina", "Bar"),
                        List.of("https://ejemplo.com/charlee1.jpg", "https://ejemplo.com/charlee2.jpg")
                ),

                // Sofitel Legend (Política premium)
                new ProductDefinition(
                        "Sofitel Legend Santa Clara",
                        "Ex convento colonial de lujo",
                        "Experiencia histórica en Cartagena",
                        "Cartagena",
                        "Bolívar",
                        "Calle del Torno #39-29",
                        "+5756504700",
                        5.0,
                        categories.get("Resorts"),
                        new PolicyDefinition(
                                "Check-in: 4:00 PM | Check-out: 1:00 PM",
                                "Tarjeta de crédito requerida para garantía",
                                "Cancelación 14 días antes. Luego 2 noches de penalidad"
                        ),
                        List.of("Wi-Fi", "Piscina", "Spa", "Restaurante gourmet"),
                        List.of("https://ejemplo.com/sofitel1.jpg", "https://ejemplo.com/sofitel2.jpg")
                ),

                new ProductDefinition(
                        "Hotel Laurita",
                        "Ex convento colonial de lujo",
                        "Experiencia histórica en Cartagena",
                        "Cartagena",
                        "Bolívar",
                        "Calle del Torno #39-29",
                        "+5756504700",
                        5.0,
                        categories.get("Hoteles"),
                        new PolicyDefinition(
                                "Check-in: 4:00 PM | Check-out: 1:00 PM",
                                "Tarjeta de crédito requerida para garantía",
                                "Cancelación 14 días antes. Luego 2 noches de penalidad"
                        ),
                        List.of("Wi-Fi", "Piscina", "Spa"),
                        List.of("https://ejemplo.com/sofitel1.jpg", "https://ejemplo.com/sofitel2.jpg")
                )
        );

        products.forEach(definition -> {
            City city = cityRepository.findByNameAndState(definition.cityName(),
                            stateRepository.findByNameAndCountry(definition.stateName(), country).orElseThrow())
                    .orElseThrow();

            Set<Feature> productFeatures = definition.features().stream()
                    .map(features::get)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());

            createProduct(definition, city, productFeatures);
        });
    }

    private void createProduct(ProductDefinition definition, City city, Set<Feature> features) {
        // Dirección
        String[] addressParts = definition.fullAddress().split("#");
        Address address = Address.builder()
                .street(addressParts[0].trim())
                .number(addressParts.length > 1 ? addressParts[1].trim() : "S/N")
                .city(city)
                .build();

        // Políticas personalizadas
        Policy policy = Policy.builder()
                .rules(definition.policy().rules())
                .security(definition.policy().security())
                .cancellation(definition.policy().cancellation())
                .build();

        // Imágenes
        List<Image> images = definition.imageUrls().stream()
                .map(url -> Image.builder().title(definition.title()).imageUrl(url).build())
                .toList();

        // Producto
        Product product = Product.builder()
                .title(definition.title())
                .description(definition.description())
                .shortDescription(definition.shortDescription())
                .rating(definition.rating())
                .category(definition.category())
                .whatsappNumber(definition.whatsapp())
                .address(address)
                .policy(policy)
                .features(features)
                .images(images)
                .city(city)
                .build();

        // Relaciones bidireccionales
        address.setProduct(product);
        policy.setProduct(product);
        images.forEach(img -> img.setProduct(product));

        productRepository.save(product);
    }

    // Records para definiciones
    private record ProductDefinition(
            String title,
            String description,
            String shortDescription,
            String cityName,
            String stateName,
            String fullAddress,
            String whatsapp,
            Double rating,
            Category category,
            PolicyDefinition policy,
            List<String> features,
            List<String> imageUrls
    ) {}

    private record PolicyDefinition(
            String rules,
            String security,
            String cancellation
    ) {}
}