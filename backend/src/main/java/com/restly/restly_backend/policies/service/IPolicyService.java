package com.restly.restly_backend.policies.service;
import com.restly.restly_backend.policies.dto.PolicyDTO;

import java.util.Optional;

public interface IPolicyService {
    Optional<PolicyDTO> getPolicyById(Long id);
    PolicyDTO savePolicy(PolicyDTO policyDTO);
    PolicyDTO updatePolicy(Long id, PolicyDTO policyDTO);
    String deletePolicyById(Long id);
}
