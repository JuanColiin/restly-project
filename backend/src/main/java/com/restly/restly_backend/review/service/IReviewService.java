package com.restly.restly_backend.review.service;

import com.restly.restly_backend.review.dto.ReviewDTO;

import java.util.List;

public interface IReviewService {

    ReviewDTO createReview(ReviewDTO reviewDTO, String userEmail);

    List<ReviewDTO> getReviewsByProductId(Long productId);

    Double getAverageRatingByProductId(Long productId);

    Long getTotalReviewsByProductId(Long productId);

    List<ReviewDTO> getReviewsByUserId(Long userId);

    void deleteReviewByIdAndUser(Long reviewId, String userEmail);


}