package com.restly.restly_backend.product.dto;

import com.restly.restly_backend.category.dto.CategoryDTO;
import com.restly.restly_backend.feature.dto.FeatureDTO;
import com.restly.restly_backend.image.dto.ImageDTO;
import com.restly.restly_backend.locations.address.dto.AddressDTO;
import com.restly.restly_backend.policies.dto.PolicyDTO;
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
    private String title;
    private AddressDTO address;  // DTO de dirección para facilitar la persistencia
    private String description;
    private Integer stars;
    private String review;

    // Usamos CategoryDTO para incluir toda la información relacionada con la categoría
    private CategoryDTO category;

    // Usamos PolicyDTO para incluir toda la información relacionada con la política
    private PolicyDTO policy;

    // Usamos FeatureDTO en lugar de solo IDs, para manejar características completas
    private Set<FeatureDTO> features = new HashSet<>();

    // Usamos ImageDTO en lugar de solo IDs, para manejar imágenes completas
    private List<ImageDTO> images = new ArrayList<>();
}


