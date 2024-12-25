package com.restly.restly_backend.feature.service.impl;

import com.restly.restly_backend.feature.entity.Feature;
import com.restly.restly_backend.feature.repository.IFeatureRepository;
import com.restly.restly_backend.feature.service.IFeatureService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FeatureServiceImpl implements IFeatureService {

    private final IFeatureRepository featureRepository;

    @Override
    public List<Feature> getAllFeatures() {
        return featureRepository.findAll();
    }

    @Override
    public Optional<Feature> getFeatureById(Long id) {
        return featureRepository.findById(id);
    }

    @Override
    public Optional<Feature> getFeatureByTitle(String title) {
        return featureRepository.findByTitle(title);
    }

    @Override
    @Transactional
    public Feature saveFeature(Feature feature) {
        if (feature == null || feature.getTitle() == null || feature.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("El título de la característica no puede ser nulo ni vacío");
        }
        return featureRepository.save(feature);
    }

    @Override
    @Transactional
    public Feature updateFeature(Feature feature) {
        if (feature == null || feature.getId() == null) {
            throw new IllegalArgumentException("Debe proporcionar una característica y su ID para actualizar");
        }

        Optional<Feature> existingFeature = featureRepository.findById(feature.getId());
        if (existingFeature.isEmpty()) {
            throw new RuntimeException("Característica con ID " + feature.getId() + " no encontrada para actualizar");
        }

        existingFeature.get().setTitle(feature.getTitle());
        return featureRepository.save(existingFeature.get());
    }

    @Override
    @Transactional
    public String deleteFeatureById(Long id) {
        Optional<Feature> existingFeature = featureRepository.findById(id);
        if (existingFeature.isEmpty()) {
            throw new RuntimeException("Característica con ID " + id + " no encontrada para eliminar");
        }

        featureRepository.deleteById(id);
        return "La característica con ID " + id + " ha sido eliminada correctamente.";
    }
}

