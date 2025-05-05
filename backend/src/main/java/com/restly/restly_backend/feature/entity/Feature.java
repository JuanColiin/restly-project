package com.restly.restly_backend.feature.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.restly.restly_backend.product.entity.Product;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "FEATURES")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Feature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feature_id", nullable = false)
    private Long id;

    @Column(name = "title", nullable = false, unique = true)
    private String title;

    @Column(name = "icon", nullable = false)
    private String icon;

    @JsonBackReference("product-features")
    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "features")
    private Set<Product> products = new HashSet<>();
}

