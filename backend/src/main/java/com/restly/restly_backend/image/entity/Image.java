package com.restly.restly_backend.image.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.restly.restly_backend.product.entity.Product;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "IMAGES")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id", nullable = false)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @JsonBackReference
    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
}
