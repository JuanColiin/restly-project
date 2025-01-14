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
        Feature savedFeature = resolveFeature(featureDTO); // La validación de 'title' ya está aquí
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

    private Feature resolveFeature(FeatureDTO featureDTO) {
        Feature feature = modelMapper.map(featureDTO, Feature.class);

        // Verificar que el 'title' no sea null o vacío
        if (feature.getTitle() == null || feature.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("El título de la característica no puede ser nulo o vacío.");
        }

        // Guardar la entidad Feature
        return featureRepository.save(feature);
    }
}

