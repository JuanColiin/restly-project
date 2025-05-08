package com.restly.restly_backend.policies.service.impl;

import com.restly.restly_backend.policies.dto.PolicyDTO;
import com.restly.restly_backend.policies.entity.Policy;
import com.restly.restly_backend.policies.repository.IPolicyRepository;
import com.restly.restly_backend.policies.service.IPolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import org.modelmapper.ModelMapper;


@Service
@RequiredArgsConstructor
public class PolicyServiceImpl implements IPolicyService {

    private final IPolicyRepository policyRepository;
    private final ModelMapper modelMapper;

    @Override
    public Optional<PolicyDTO> getPolicyById(Long id) {
        return policyRepository.findById(id)
                .map(policy -> modelMapper.map(policy, PolicyDTO.class));
    }

    @Override
    @Transactional
    public PolicyDTO savePolicy(PolicyDTO policyDTO) {
        if (policyDTO == null) {
            throw new IllegalArgumentException("La política no puede ser nula");
        }
        Policy policy = modelMapper.map(policyDTO, Policy.class);
        Policy savedPolicy = policyRepository.save(policy);
        return modelMapper.map(savedPolicy, PolicyDTO.class);
    }

    @Override
    @Transactional
    public PolicyDTO updatePolicy(Long id, PolicyDTO policyDTO) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Política con ID " + id + " no encontrada"));

        modelMapper.map(policyDTO, policy);  // Mapea los datos de DTO a la entidad
        Policy updatedPolicy = policyRepository.save(policy);
        return modelMapper.map(updatedPolicy, PolicyDTO.class);
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
