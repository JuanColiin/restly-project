package com.restly.restly_backend.category.service;

import com.restly.restly_backend.category.dto.CategoryDTO;
import com.restly.restly_backend.category.entity.Category;

import java.util.List;
import java.util.Optional;
import java.util.List;
import java.util.Optional;

public interface ICategoryService {

    List<CategoryDTO> getAllCategories();

    Optional<CategoryDTO> getCategoryById(Long id);

    Category getCategory(String categoryName); // Ahora devuelve una entidad Category

    CategoryDTO saveCategory(CategoryDTO categoryDTO);

    CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO);

    String deleteCategoryById(Long id);
}

