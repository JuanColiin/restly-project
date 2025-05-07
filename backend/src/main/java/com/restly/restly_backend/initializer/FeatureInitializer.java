package com.restly.restly_backend.initializer;

import com.restly.restly_backend.feature.entity.Feature;
import com.restly.restly_backend.feature.repository.IFeatureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import jakarta.transaction.Transactional;

import java.util.List;

@Component
@Order(1)
@RequiredArgsConstructor
public class FeatureInitializer implements CommandLineRunner {

    private final IFeatureRepository featureRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (featureRepository.count() == 0) {
            List<Feature> features = List.of(

                    Feature.builder().title("Wi-Fi").icon("Wifi").build(),
                    Feature.builder().title("Piscina").icon("Pool").build(),
                    Feature.builder().title("Spa").icon("Spa").build(),
                    Feature.builder().title("Ducha caliente").icon("Shower").build(),
                    Feature.builder().title("Desayuno Incluido").icon("BreakfastDining").build(),
                    Feature.builder().title("Gimnasio").icon("FitnessCenter").build(),
                    Feature.builder().title("Restaurante").icon("Restaurant").build(),
                    Feature.builder().title("Bar").icon("LocalBar").build()
            );

            featureRepository.saveAll(features);
            System.out.println("8 features iniciales creados (Wi-Fi, Piscina, Estacionamiento, etc.)");
        }
    }
}