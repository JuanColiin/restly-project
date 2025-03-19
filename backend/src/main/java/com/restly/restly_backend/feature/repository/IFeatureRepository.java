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
    @Query("DELETE FROM ProductFeature pf WHERE pf.feature.id = :featureId")
    void deleteByFeatureId(@Param("featureId") Long featureId);
}
