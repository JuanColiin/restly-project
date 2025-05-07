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
                System.out.println("Ejecuta primero CategoryInitializer y FeatureInitializer");
                return;
            }

            Country colombia = configureColombiaLocations();
            createColombianProducts(colombia);

            System.out.println("Productos creados con políticas personalizadas");
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
                "Magdalena", createState("Magdalena", colombia),
                "Quindío", createState("Quindío", colombia)
        );

        Map<String, City> cities = Map.of(
                "Bogotá", createCity("Bogotá", states.get("Bogotá D.C.")),
                "Medellín", createCity("Medellín", states.get("Antioquia")),
                "Cartagena", createCity("Cartagena", states.get("Bolívar")),
                "Santa Marta", createCity("Santa Marta", states.get("Magdalena")),
                "Montenegro", createCity("Montenegro", states.get("Quindío"))
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
                        List.of("https://cf.bstatic.com/xdata/images/hotel/max1280x900/197251451.jpg?k=64f89e4b3a5d4de6cddcce53f3e9fb990d2e5ed08a89dd374b7a1a99d5322343&o=&hp=1",
                                "https://cf.bstatic.com/xdata/images/hotel/max1280x900/631186464.jpg?k=8524f16a19f3297e9ede9b79f06a6af0d15d266845809c1adaf533ae90548d14&o=&hp=1",
                                "https://cf.bstatic.com/xdata/images/hotel/max1280x900/626108640.jpg?k=fcd5fcf40363f042090b881e499a0f4884946929b71699431008d456d704d9ba&o=&hp=1",
                                "https://cf.bstatic.com/xdata/images/hotel/max1280x900/626108629.jpg?k=eef1c5daae0a16af73e3b661fe33d5588c6f112c485ddcd9d6c45bdfad1638b2&o=&hp=1",
                                "https://cf.bstatic.com/xdata/images/hotel/max1280x900/626108605.jpg?k=3523e7e23889f2dea60c62bbbed01e0430240745fc5e9cdb6987ca7315683864&o=&hp=1",
                                "https://cf.bstatic.com/xdata/images/hotel/max1280x900/626108598.jpg?k=4988293401f20f506dde1aaf6517546a407027e020ca76a3eba11e992463cdff&o=&hp=1")
                ),


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
                        List.of("https://cf.bstatic.com/xdata/images/hotel/max1280x900/593025139.jpg?k=149939359f85e627f0429488e04f849ccce98de7ee3582074d6fa1da591cefa4&o=&hp=1",
                                "https://cf.bstatic.com/xdata/images/hotel/max1280x900/591632064.jpg?k=4d9fa55e4471d2f078f9232735333f3842fdb740d5aa71ffe5ce583b9318f40d&o=&hp=1",
                                "https://cf.bstatic.com/xdata/images/hotel/max1280x900/591632067.jpg?k=f24f52811e33b7c1e9c76d1f2fdd2669ec5342cefc5ef1fe41d7148787c9931a&o=&hp=1",
                                "https://cf.bstatic.com/xdata/images/hotel/max1280x900/591629555.jpg?k=005e791db8871522d7e4a202edf9ea0b7e0d5f6182b163545f1400ec0aa17373&o=&hp=1",
                                "https://cf.bstatic.com/xdata/images/hotel/max1280x900/591638976.jpg?k=6787dba57a8219c2195bc4ca565c7a30a67489e2c28c3514441e205beec285da&o=&hp=1",
                                "https://cf.bstatic.com/xdata/images/hotel/max1280x900/591632088.jpg?k=b66a3ff25731084493b116f23d97b394c12fb62806083adb0b341c6b7666fb0e&o=&hp=1")
                ),

                new ProductDefinition(
                        "Sofitel Legend Santa Clara",
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
                        List.of("Wi-Fi", "Piscina", "Spa", "Restaurante gourmet"),
                        List.of("https://cf.bstatic.com/xdata/images/hotel/max1280x900/301874381.jpg?k=438a08f3d4feba9e45839bd0d2854524057489d00d74b6a293c62f7275c783a6&o=&hp=1",
                                "https://cf.bstatic.com/xdata/images/hotel/max1280x900/301874388.jpg?k=02d2369011a10b04e998630b14cebec1279024e1aa21ff4379df3438fbf9c8b6&o=&hp=1",
                                "https://cf.bstatic.com/xdata/images/hotel/max1280x900/251797240.jpg?k=d1f469a684f9110a1c37157eff7e0180ac0f55be2dcfc7913bd5e095ed4a42f4&o=&hp=1",
                                "https://cf.bstatic.com/xdata/images/hotel/max1280x900/251797243.jpg?k=28c22f9604d84bbd999141fece885ce525860efdd4c1d9a608063efe16fa835b&o=&hp=1",
                                "https://cf.bstatic.com/xdata/images/hotel/max1280x900/251797244.jpg?k=18008d9547a0d2aa7a42ccdaf4c70484b7b6a9e89758feaf9665e1d76142c14c&o=&hp=1",
                                "https://cf.bstatic.com/xdata/images/hotel/max1280x900/251797247.jpg?k=dbec2a99bc51533cb7cd4b08f2856a47d592c6df1beea0ea758296f7b7df9729&o=&hp=1")
                ),

                new ProductDefinition(
                        "Casa Panorama ",
                        "Panorama Pueblo Tapao  ubicado a tan solo 10 minutos del parque del café y a 30 minutos de Aeropuerto de Armenia",
                        "Experiencia en una casa de campo tipica en Pueblo Tapao",
                        "Montenegro",
                        "Quindío",
                        "Vereda prado #39-29",
                        "+5756504700",
                        5.0,
                        categories.get("Casas de campo"),
                        new PolicyDefinition(
                                "Check-in: 4:00 PM | Check-out: 1:00 PM",
                                "Tarjeta de crédito requerida para garantía",
                                "Cancelación 14 días antes. Luego 2 noches de penalidad"
                        ),
                        List.of("Wi-Fi", "Piscina", "Spa"),
                        List.of("https://a0.muscache.com/im/pictures/miso/Hosting-37749189/original/bf5233c5-10d4-4c4f-9648-5e9261e3cada.jpeg?im_w=1200",
                                "https://a0.muscache.com/im/pictures/miso/Hosting-37749189/original/36bb00dc-2a2c-4687-92ea-321cbce225fe.jpeg?im_w=1440",
                                "https://a0.muscache.com/im/pictures/miso/Hosting-37749189/original/e5f40b42-e413-475f-95ac-6fa8b8167da2.jpeg?im_w=1440",
                                "https://a0.muscache.com/im/pictures/miso/Hosting-37749189/original/a8a81ea0-d880-4923-b324-09390e00a616.jpeg?im_w=1440",
                                "https://a0.muscache.com/im/pictures/miso/Hosting-37749189/original/c6fe1c7b-394c-457b-b1bd-e245362a8b4f.jpeg?im_w=1440",
                                "https://a0.muscache.com/im/pictures/miso/Hosting-37749189/original/abed4421-a06d-469a-9b2d-977ba5cdce93.jpeg?im_w=1440")
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


        Policy policy = Policy.builder()
                .rules(definition.policy().rules())
                .security(definition.policy().security())
                .cancellation(definition.policy().cancellation())
                .build();


        List<Image> images = definition.imageUrls().stream()
                .map(url -> Image.builder().title(definition.title()).imageUrl(url).build())
                .toList();

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


        address.setProduct(product);
        policy.setProduct(product);
        images.forEach(img -> img.setProduct(product));

        productRepository.save(product);
    }


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