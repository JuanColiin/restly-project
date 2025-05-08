package com.restly.restly_backend.review.repository;

import com.restly.restly_backend.product.entity.Product;
import com.restly.restly_backend.review.entity.Review;
import com.restly.restly_backend.security.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProduct(Product product);

    boolean existsByUserAndProduct(User user, Product product);

    List<Review> findByUserId(Long userId);

    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Review r WHERE r.product.id = :productId")
    Double calculateAverageRatingByProductId(@Param("productId") Long productId);





}