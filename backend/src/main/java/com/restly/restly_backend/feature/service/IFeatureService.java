package com.restly.restly_backend.feature.service;

import com.restly.restly_backend.feature.entity.Feature;

import java.util.List;
import java.util.Optional;

public interface IFeatureService {
    List<Feature> getAllFeatures();
    Optional<Feature> getFeatureById(Long id);
    Optional<Feature> getFeatureByTitle(String title);
    Feature saveFeature(Feature feature);
    Feature updateFeature(Feature feature);
    String deleteFeatureById(Long id);
}

