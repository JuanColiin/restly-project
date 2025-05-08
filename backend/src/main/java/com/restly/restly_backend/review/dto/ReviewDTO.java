package com.restly.restly_backend.review.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDTO {

    private Long id;

    private Integer rating;

    private String comment;

    private LocalDateTime createdAt;

    private String userName;

    private Long productId;

    private String userEmail;

}