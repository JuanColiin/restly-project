package com.restly.restly_backend.policies.controller;

import com.restly.restly_backend.policies.dto.PolicyDTO;
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
            Optional<PolicyDTO> policy = policyService.getPolicyById(id);

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
    public ResponseEntity<?> createPolicy(@RequestBody PolicyDTO policyDTO) {
        try {
            PolicyDTO createdPolicy = policyService.savePolicy(policyDTO);
            return new ResponseEntity<>(createdPolicy, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al crear la política. Detalles: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePolicy(@PathVariable Long id, @RequestBody PolicyDTO policyDTO) {
        try {
            PolicyDTO updatedPolicy = policyService.updatePolicy(id, policyDTO);
            return ResponseEntity.ok(updatedPolicy);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Política con ID " + id + " no encontrada");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar la política. Detalles: " + e.getMessage());
        }
    }

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
