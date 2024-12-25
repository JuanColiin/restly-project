package com.restly.restly_backend.category.service.impl;

import com.restly.restly_backend.category.entity.Category;
import com.restly.restly_backend.category.repository.ICategoryRepository;
import com.restly.restly_backend.category.service.ICategoryService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements ICategoryService {

    private final ICategoryRepository categoryRepository;

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    @Override
    public Optional<Category> getCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }

    @Override
    @Transactional
    public Category saveCategory(Category category) {
        if (category == null || category.getName() == null || category.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("El título de la categoría no puede ser nulo ni vacío");
        }
        return categoryRepository.save(category);
    }

    @Override
    @Transactional
    public Category updateCategory(Category category) {
        if (category == null || category.getId() == null) {
            throw new IllegalArgumentException("Debe proporcionar una categoría y su ID para actualizar");
        }

        Optional<Category> existingCategory = categoryRepository.findById(category.getId());
        if (existingCategory.isEmpty()) {
            throw new RuntimeException("Categoría con ID " + category.getId() + " no encontrada para actualizar");
        }

        existingCategory.get().setName(category.getName());
        existingCategory.get().setDescription(category.getDescription());
        existingCategory.get().setImageUrl(category.getImageUrl());

        return categoryRepository.save(existingCategory.get());
    }

    @Override
    @Transactional
    public String deleteCategoryById(Long id) {
        Optional<Category> existingCategory = categoryRepository.findById(id);
        if (existingCategory.isEmpty()) {
            throw new RuntimeException("Categoría con ID " + id + " no encontrada para eliminar");
        }

        categoryRepository.deleteById(id);
        return "La categoría con ID " + id + " ha sido eliminada correctamente.";
    }
}

