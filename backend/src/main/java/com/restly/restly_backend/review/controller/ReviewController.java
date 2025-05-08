package com.restly.restly_backend.review.controller;

import com.restly.restly_backend.review.dto.ReviewDTO;
import com.restly.restly_backend.review.service.IReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final IReviewService reviewService;

    private final Map<Long, Double> ratingCache = new ConcurrentHashMap<>();


    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    public ResponseEntity<ReviewDTO> createReview(
            @RequestBody ReviewDTO reviewDTO,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails.getUsername();
        ReviewDTO createdReview = reviewService.createReview(reviewDTO, email);
        ratingCache.remove(reviewDTO.getProductId());
        return ResponseEntity.ok(createdReview);
    }


    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByProductId(@PathVariable Long productId) {
        List<ReviewDTO> reviews = reviewService.getReviewsByProductId(productId);
        return ResponseEntity.ok(reviews);
    }


    @GetMapping("/product/{productId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long productId) {
        // Verificar cache primero
        if (ratingCache.containsKey(productId)) {
            return ResponseEntity.ok(ratingCache.get(productId));
        }

        Double average = reviewService.getAverageRatingByProductId(productId);
        // Guardar en cache
        ratingCache.put(productId, average);
        return ResponseEntity.ok(average);
    }

    @GetMapping("/product/{productId}/count")
    public ResponseEntity<Long> getTotalReviews(@PathVariable Long productId) {
        Long total = reviewService.getTotalReviewsByProductId(productId);
        return ResponseEntity.ok(total);
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByUserId(@PathVariable Long userId) {
        List<ReviewDTO> reviews = reviewService.getReviewsByUserId(userId);
        return ResponseEntity.ok(reviews);
    }

    @DeleteMapping("/{reviewId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
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

    @GetMapping("/average-ratings")
    public ResponseEntity<Map<Long, Double>> getAverageRatingsForProducts(
            @RequestParam List<Long> productIds
    ) {
        Map<Long, Double> averages = reviewService.getAverageRatingsForProducts(productIds);
        return ResponseEntity.ok(averages);
    }
}