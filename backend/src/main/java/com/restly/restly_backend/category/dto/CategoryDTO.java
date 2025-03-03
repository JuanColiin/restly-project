package com.restly.restly_backend.category.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@AllArgsConstructor
@Data
@NoArgsConstructor
public class CategoryDTO {
    @NotNull(message = "El nombre de la categoría es obligatorio.")
    private String name;
    private String description;
    private String imageUrl;
    private Long totalProducts;
}

