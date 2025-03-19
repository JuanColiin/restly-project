package com.restly.restly_backend.feature.repository;

import com.restly.restly_backend.feature.entity.Feature;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IFeatureRepository extends JpaRepository<Feature, Long> {
    Optional<Feature> findByTitle(String title);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM product_features WHERE feature_id = :featureId", nativeQuery = true)
    void deleteFeatureReferences(@Param("featureId") Long featureId);

}
