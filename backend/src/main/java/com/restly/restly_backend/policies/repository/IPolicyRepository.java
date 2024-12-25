package com.restly.restly_backend.policies.repository;

import com.restly.restly_backend.policies.entity.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IPolicyRepository extends JpaRepository<Policy, Long> {
    Optional<Policy> findById(Long id);
}

