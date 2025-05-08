package com.restly.restly_backend.favorites.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.restly.restly_backend.product.entity.Product;
import com.restly.restly_backend.security.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "FAVORITES", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "product_id"})
})
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "favorite_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    @org.hibernate.annotations.OnDelete(action = org.hibernate.annotations.OnDeleteAction.CASCADE)
    @JsonBackReference
    private Product product;

}
