package com.restly.restly_backend.category.service;

import com.restly.restly_backend.category.entity.Category;

import java.util.List;
import java.util.Optional;

public interface ICategoryService {
    List<Category> getAllCategories();
    Optional<Category> getCategoryById(Long id);
    Optional<Category> getCategoryByName(String name);
    Category saveCategory(Category category);
    Category updateCategory(Category category);
    String deleteCategoryById(Long id);
}
