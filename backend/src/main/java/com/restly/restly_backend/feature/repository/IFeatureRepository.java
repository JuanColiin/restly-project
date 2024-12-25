package com.restly.restly_backend.feature.repository;

import com.restly.restly_backend.feature.entity.Feature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IFeatureRepository extends JpaRepository<Feature, Long> {
    Optional<Feature> findByTitle(String title);
}
