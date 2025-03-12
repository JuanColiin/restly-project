package com.restly.restly_backend.feature.service.impl;

import com.restly.restly_backend.feature.dto.FeatureDTO;
import com.restly.restly_backend.feature.entity.Feature;
import com.restly.restly_backend.feature.repository.IFeatureRepository;
import com.restly.restly_backend.feature.service.IFeatureService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeatureServiceImpl implements IFeatureService {

    private final IFeatureRepository featureRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<FeatureDTO> getAllFeatures() {
        List<Feature> features = featureRepository.findAll();
        return features.stream()
                .map(feature -> modelMapper.map(feature, FeatureDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public FeatureDTO getFeatureById(Long id) {
        Feature feature = featureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Característica con ID " + id + " no encontrada."));
        return modelMapper.map(feature, FeatureDTO.class);
    }

    @Override
    @Transactional
    public FeatureDTO saveFeature(FeatureDTO featureDTO) {
        Optional<Feature> existingFeature = featureRepository.findByTitle(featureDTO.getTitle());

        if (existingFeature.isPresent()) {
            throw new IllegalArgumentException("La característica con el título '" + featureDTO.getTitle() + "' ya existe.");
        }

        Feature newFeature = new Feature();
        newFeature.setTitle(featureDTO.getTitle());
        newFeature.setIcon(featureDTO.getIcon());

        Feature savedFeature = featureRepository.save(newFeature);
        return modelMapper.map(savedFeature, FeatureDTO.class);
    }

    @Override
    @Transactional
    public FeatureDTO updateFeature(Long id, FeatureDTO featureDTO) {
        if (featureDTO == null) {
            throw new IllegalArgumentException("Debe proporcionar una característica para actualizar.");
        }

        Feature existingFeature = featureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Característica con ID " + id + " no encontrada."));

        existingFeature.setTitle(featureDTO.getTitle());
        existingFeature.setIcon(featureDTO.getIcon());

        Feature updatedFeature = featureRepository.save(existingFeature);
        return modelMapper.map(updatedFeature, FeatureDTO.class);
    }

    @Override
    @Transactional
    public String deleteFeatureById(Long id) {
        Feature existingFeature = featureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Característica con ID " + id + " no encontrada."));

        featureRepository.deleteById(id);
        return "La característica con ID " + id + " ha sido eliminada correctamente.";
    }
}

