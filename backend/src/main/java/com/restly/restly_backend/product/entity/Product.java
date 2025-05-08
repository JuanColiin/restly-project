package com.restly.restly_backend.product.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.restly.restly_backend.locations.address.entity.Address;
import com.restly.restly_backend.category.entity.Category;
import com.restly.restly_backend.feature.entity.Feature;
import com.restly.restly_backend.image.entity.Image;
import com.restly.restly_backend.locations.city.entity.City;
import com.restly.restly_backend.policies.entity.Policy;
import com.restly.restly_backend.reserves.entity.Reserve;
import com.restly.restly_backend.review.entity.Review;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "PRODUCTS")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id", nullable = false)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Address address;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "short_description", nullable = false, columnDefinition = "TEXT")
    private String shortDescription;

    @Column(name = "rating")
    private Double rating;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "city_id")
    private City city;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    @JsonBackReference
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonIgnore
    private List<Review> reviews = new ArrayList<>();

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "policy_id")
    private Policy policy;

    @JsonManagedReference("product-features")
    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "product_features",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "feature_id")
    )
    private Set<Feature> features = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images = new ArrayList<>();

    @JsonBackReference("product-reserves")
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Reserve> reserves = new HashSet<>();

    @Column(name = "whatsapp_number")
    private String whatsappNumber;
}
