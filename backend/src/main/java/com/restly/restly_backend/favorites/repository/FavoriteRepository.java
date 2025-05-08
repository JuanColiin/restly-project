package com.restly.restly_backend.favorites.repository;



import com.restly.restly_backend.favorites.entity.Favorite;
import com.restly.restly_backend.product.entity.Product;
import com.restly.restly_backend.security.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    Optional<Favorite> findByUserAndProduct(User user, Product product);

    List<Favorite> findByUser(User user);

    void deleteByUserAndProduct(User user, Product product);
}
