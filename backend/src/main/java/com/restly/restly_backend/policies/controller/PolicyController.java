package com.restly.restly_backend.policies.controller;

import com.restly.restly_backend.policies.entity.Policy;
import com.restly.restly_backend.policies.service.IPolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/policies")
@RequiredArgsConstructor
public class PolicyController {

    private final IPolicyService policyService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getPolicyById(@PathVariable Long id) {
        try {
            Optional<Policy> policy = policyService.getPolicyById(id);

            if (policy.isPresent()) {
                return ResponseEntity.ok(policy.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Política con ID " + id + " no encontrada"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener la política. Detalles: " + e.getMessage()));
        }
    }



    @PostMapping
    public ResponseEntity<?> createPolicy(@RequestBody Policy policy) {
        try {
            Policy createdPolicy = policyService.savePolicy(policy);
            return new ResponseEntity<>(createdPolicy, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al crear la política. Detalles: " + e.getMessage());
        }
    }


    // Actualizar política
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePolicy(@PathVariable Long id, @RequestBody Policy policy) {
        policy.setId(id);
        try {
            Policy updatedPolicy = policyService.updatePolicy(policy);
            return ResponseEntity.ok(updatedPolicy);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("La política no es válida para actualizar: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Política con ID " + id + " no encontrada");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar la política. Detalles: " + e.getMessage());
        }
    }

    // Eliminar política
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePolicy(@PathVariable Long id) {
        try {
            String response = policyService.deletePolicyById(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Política con ID " + id + " no encontrada para eliminar");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar la política. Detalles: " + e.getMessage());
        }
    }
}
