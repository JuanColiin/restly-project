package com.restly.restly_backend.policies.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.restly.restly_backend.product.entity.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Entity
@Table(name = "POLICIES")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Policy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "policy_id", nullable = false)
    private Long id;

    @Column(name = "rules", columnDefinition = "TEXT")
    private String rules;

    @Column(name = "security", columnDefinition = "TEXT")
    private String security;

    @Column(name = "cancellation", columnDefinition = "TEXT")
    private String cancellation;

    @JsonBackReference
    @OneToOne(mappedBy = "policy", optional = false, cascade = CascadeType.MERGE)
    private Product product;
}
