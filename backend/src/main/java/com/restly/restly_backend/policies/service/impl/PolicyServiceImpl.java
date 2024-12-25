package com.restly.restly_backend.policies.service.impl;

import com.restly.restly_backend.policies.entity.Policy;
import com.restly.restly_backend.policies.repository.IPolicyRepository;
import com.restly.restly_backend.policies.service.IPolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PolicyServiceImpl implements IPolicyService {

    private final IPolicyRepository policyRepository;

    @Override
    public Optional<Policy> getPolicyById(Long id) {
        return policyRepository.findById(id);
    }

    @Override
    @Transactional
    public Policy savePolicy(Policy policy) {
        if (policy == null) {
            throw new IllegalArgumentException("La política no puede ser nula");
        }
        return policyRepository.save(policy);
    }

    @Override
    @Transactional
    public Policy updatePolicy(Policy policy) {
        if (policy == null || policy.getId() == null) {
            throw new IllegalArgumentException("Debe proporcionar la política y su ID para actualizar");
        }
        return policyRepository.save(policy);
    }

    @Override
    @Transactional
    public String deletePolicyById(Long id) {
        if (!policyRepository.existsById(id)) {
            throw new RuntimeException("Política con ID " + id + " no encontrada para eliminar");
        }
        policyRepository.deleteById(id);
        return "Política con ID " + id + " ha sido eliminada correctamente";
    }
}
