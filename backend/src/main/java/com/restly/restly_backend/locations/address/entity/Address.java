package com.restly.restly_backend.locations.address.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.restly.restly_backend.locations.city.entity.City;
import com.restly.restly_backend.product.entity.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ADDRESSES")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id", nullable = false)
    private Long id;

    @Column(name = "street", nullable = false)
    private String street;

    @Column(name = "number", nullable = false)
    private String number;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "city_id", nullable = false)
    private City city;

    @JsonBackReference
    @OneToOne(mappedBy = "address", optional = false, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private Product product;
}
