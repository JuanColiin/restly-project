package com.restly.restly_backend.feature.controller;

import com.restly.restly_backend.feature.dto.FeatureDTO;
import com.restly.restly_backend.feature.service.IFeatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import java.util.List;


@RestController
@RequestMapping("/features")
@RequiredArgsConstructor
public class FeatureController {

    private final IFeatureService featureService;

    @GetMapping
    public ResponseEntity<List<FeatureDTO>> getAllFeatures() {
        List<FeatureDTO> features = featureService.getAllFeatures();
        if (features.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(features);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFeatureById(@PathVariable Long id) {
        try {
            FeatureDTO featureDTO = featureService.getFeatureById(id);
            return ResponseEntity.ok(featureDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener la característica: " + e.getMessage());
        }
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> saveFeature(@RequestBody FeatureDTO featureDTO) {
        try {
            FeatureDTO savedFeature = featureService.saveFeature(featureDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedFeature);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("La característica con el título '"
                    + featureDTO.getTitle() + "' ya existe.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar la característica: " + e.getMessage());
        }
    }



    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateFeature(@PathVariable Long id, @RequestBody FeatureDTO featureDTO) {
        try {
            FeatureDTO updatedFeature = featureService.updateFeature(id, featureDTO);
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
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
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
