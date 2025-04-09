package com.restly.restly_backend.product.dto;

import com.restly.restly_backend.category.dto.CategoryDTO;
import com.restly.restly_backend.feature.dto.FeatureDTO;
import com.restly.restly_backend.image.dto.ImageDTO;
import com.restly.restly_backend.locations.address.dto.AddressDTO;
import com.restly.restly_backend.policies.dto.PolicyDTO;
import com.restly.restly_backend.review.dto.ReviewDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class ProductDTO {
    private Long id;
    private String title;
    private AddressDTO address;
    private String description;
    private String shortDescription;
    private List<ReviewDTO> reviews;
    private CategoryDTO category;
    private PolicyDTO policy;
    private Set<FeatureDTO> features = new HashSet<>();
    private List<ImageDTO> images = new ArrayList<>();
}


