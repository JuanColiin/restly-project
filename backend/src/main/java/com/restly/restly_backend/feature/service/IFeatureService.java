package com.restly.restly_backend.feature.service;

import com.restly.restly_backend.feature.dto.FeatureDTO;
import com.restly.restly_backend.feature.entity.Feature;

import java.util.List;
import java.util.Optional;

public interface IFeatureService {
    List<FeatureDTO> getAllFeatures();
    FeatureDTO getFeatureById(Long id);
    FeatureDTO saveFeature(FeatureDTO featureDTO);
    FeatureDTO updateFeature(Long id, FeatureDTO featureDTO);
    String deleteFeatureById(Long id);
}
