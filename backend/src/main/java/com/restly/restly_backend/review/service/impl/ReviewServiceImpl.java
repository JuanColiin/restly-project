package com.restly.restly_backend.review.service.impl;

import com.restly.restly_backend.product.entity.Product;
import com.restly.restly_backend.product.repository.IProductRepository;
import com.restly.restly_backend.reserves.repository.IReserveRepository;
import com.restly.restly_backend.review.dto.ReviewDTO;
import com.restly.restly_backend.review.entity.Review;
import com.restly.restly_backend.review.repository.IReviewRepository;
import com.restly.restly_backend.review.service.IReviewService;
import com.restly.restly_backend.security.entity.User;
import com.restly.restly_backend.security.repository.IUserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.List;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements IReviewService {

    private final IReviewRepository reviewRepository;
    private final IUserRepository userRepository;
    private final IProductRepository productRepository;
    private final IReserveRepository reserveRepository;
    private final ModelMapper modelMapper;

    @Override
    public ReviewDTO createReview(ReviewDTO reviewDTO, String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() ->
                new RuntimeException("Usuario no encontrado"));

        Product product = productRepository.findById(reviewDTO.getProductId()).orElseThrow(() ->
                new RuntimeException("Producto no encontrado"));

        boolean hasFinishedReservation = reserveRepository
                .findByUserAndProduct(user, product)
                .stream()
                .anyMatch(reserve -> reserve.getCheckOut().isBefore(LocalDate.now()));

        if (!hasFinishedReservation) {
            throw new RuntimeException("Solo puedes valorar productos que hayas reservado y finalizado.");
        }

        Review review = new Review();
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());
        review.setCreatedAt(LocalDateTime.now());
        review.setUser(user);
        review.setProduct(product);

        Review saved = reviewRepository.save(review);

        ReviewDTO responseDTO = modelMapper.map(saved, ReviewDTO.class);
        responseDTO.setUserName(user.getFirstname() + " " + user.getLastname());
        responseDTO.setUserEmail(user.getEmail());
        responseDTO.setProductId(product.getId());

        return responseDTO;
    }

    @Override
    public List<ReviewDTO> getReviewsByProductId(Long productId) {
        Product product = productRepository.findById(productId).orElseThrow(() ->
                new RuntimeException("Producto no encontrado"));

        return reviewRepository.findByProduct(product).stream()
                .map(review -> {
                    ReviewDTO dto = modelMapper.map(review, ReviewDTO.class);
                    dto.setUserName(review.getUser().getFirstname() + " " + review.getUser().getLastname());
                    dto.setUserEmail(review.getUser().getEmail());
                    dto.setProductId(productId);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public Double getAverageRatingByProductId(Long productId) {
        return reviewRepository.calculateAverageRatingByProductId(productId);
    }

    @Override
    public Map<Long, Double> getAverageRatingsForProducts(List<Long> productIds) {
        Map<Long, Double> result = new HashMap<>();
        productIds.forEach(id -> {
            result.put(id, reviewRepository.calculateAverageRatingByProductId(id));
        });
        return result;
    }






    @Override
    public Long getTotalReviewsByProductId(Long productId) {
        Product product = productRepository.findById(productId).orElseThrow(() ->
                new RuntimeException("Producto no encontrado"));

        return (long) reviewRepository.findByProduct(product).size();
    }

    @Override
    public List<ReviewDTO> getReviewsByUserId(Long userId) {
        List<Review> reviews = reviewRepository.findByUserId(userId);
        return reviews.stream().map(review -> {
            ReviewDTO dto = modelMapper.map(review, ReviewDTO.class);
            dto.setUserName(review.getUser().getFirstname() + " " + review.getUser().getLastname());
            dto.setUserEmail(review.getUser().getEmail());
            return dto;
        }).collect(Collectors.toList());
    }


    @Override
    public void deleteReviewByIdAndUser(Long reviewId, String userEmail) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review no encontrada"));

        if (!review.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("No tienes permiso para eliminar esta reseña");
        }

        reviewRepository.delete(review);
    }

}