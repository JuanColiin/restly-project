package com.restly.restly_backend.feature.controller;

import com.restly.restly_backend.feature.entity.Feature;
import com.restly.restly_backend.feature.service.IFeatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/features")
@RequiredArgsConstructor
public class FeatureController {

    private final IFeatureService featureService;

    @GetMapping
    public ResponseEntity<List<Feature>> getAllFeatures() {
        try {
            List<Feature> features = featureService.getAllFeatures();
            return ResponseEntity.ok(features);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFeatureById(@PathVariable Long id) {
        if (id == null || id <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("El ID proporcionado no es válido. Debe ser un número positivo.");
        }

        try {
            Optional<Feature> feature = featureService.getFeatureById(id);
            if (feature.isPresent()) {
                return ResponseEntity.ok(feature.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Característica con ID " + id + " no encontrada.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener la característica. Detalles: " + e.getMessage());
        }
    }


    @PostMapping
    public ResponseEntity<?> saveFeature(@RequestBody Feature feature) {
        try {
            Feature savedFeature = featureService.saveFeature(feature);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedFeature);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar la característica: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFeature(@PathVariable Long id, @RequestBody Feature feature) {
        feature.setId(id);
        try {
            Feature updatedFeature = featureService.updateFeature(feature);
            return ResponseEntity.ok(updatedFeature);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar la característica: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFeatureById(@PathVariable Long id) {
        try {
            String message = featureService.deleteFeatureById(id);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar la característica: " + e.getMessage());
        }
    }
}
