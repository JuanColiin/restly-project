package com.restly.restly_backend.policies.service;
import com.restly.restly_backend.policies.entity.Policy;

import java.util.Optional;

public interface IPolicyService {
    Optional<Policy> getPolicyById(Long id);
    Policy savePolicy(Policy policy);
    Policy updatePolicy(Policy policy);
    String deletePolicyById(Long id);
}
