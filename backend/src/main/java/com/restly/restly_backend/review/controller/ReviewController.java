package com.restly.restly_backend.review.controller;

import com.restly.restly_backend.review.dto.ReviewDTO;
import com.restly.restly_backend.review.service.IReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final IReviewService reviewService;

    // 1. Crear una nueva reseña
    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(
            @RequestBody ReviewDTO reviewDTO,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails.getUsername();
        ReviewDTO createdReview = reviewService.createReview(reviewDTO, email);
        return ResponseEntity.ok(createdReview);
    }

    // 2. Obtener todas las reseñas de un producto
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByProductId(@PathVariable Long productId) {
        List<ReviewDTO> reviews = reviewService.getReviewsByProductId(productId);
        return ResponseEntity.ok(reviews);
    }

    // 3. Obtener el promedio de rating de un producto
    @GetMapping("/product/{productId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long productId) {
        Double average = reviewService.getAverageRatingByProductId(productId);
        return ResponseEntity.ok(average);
    }

    // 4. Obtener el total de reseñas de un producto
    @GetMapping("/product/{productId}/count")
    public ResponseEntity<Long> getTotalReviews(@PathVariable Long productId) {
        Long total = reviewService.getTotalReviewsByProductId(productId);
        return ResponseEntity.ok(total);
    }

    // 5. Obtener todas las reseñas hechas por un usuario
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByUserId(@PathVariable Long userId) {
        List<ReviewDTO> reviews = reviewService.getReviewsByUserId(userId);
        return ResponseEntity.ok(reviews);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Map<String, String>> deleteReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails.getUsername();
        reviewService.deleteReviewByIdAndUser(reviewId, email);

        Map<String, String> response = new HashMap<>();
        response.put("message", "La reseña ha sido eliminada exitosamente.");

        return ResponseEntity.ok(response);
    }



}