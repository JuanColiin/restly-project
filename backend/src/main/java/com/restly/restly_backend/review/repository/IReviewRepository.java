package com.restly.restly_backend.review.repository;

import com.restly.restly_backend.product.entity.Product;
import com.restly.restly_backend.review.entity.Review;
import com.restly.restly_backend.security.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProduct(Product product);

    boolean existsByUserAndProduct(User user, Product product);

    List<Review> findByUserId(Long userId);



}