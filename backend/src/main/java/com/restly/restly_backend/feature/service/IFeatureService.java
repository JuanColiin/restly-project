package com.restly.restly_backend.feature.service;

import com.restly.restly_backend.feature.dto.FeatureDTO;
import com.restly.restly_backend.feature.entity.Feature;

import java.util.List;
import java.util.Optional;

public interface IFeatureService {
    List<FeatureDTO> getAllFeatures(); // Devuelve todas las características como DTOs
    FeatureDTO getFeatureById(Long id); // Busca una característica por ID y devuelve un DTO
    FeatureDTO saveFeature(FeatureDTO featureDTO); // Guarda una nueva característica a partir de un DTO
    FeatureDTO updateFeature(Long id, FeatureDTO featureDTO); // Actualiza una característica existente a partir de un DTO
    String deleteFeatureById(Long id); // Elimina una característica por ID
}
