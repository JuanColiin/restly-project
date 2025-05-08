package com.restly.restly_backend.category.service.impl;

import com.restly.restly_backend.category.dto.CategoryDTO;
import com.restly.restly_backend.category.entity.Category;
import com.restly.restly_backend.category.exception.CategoryAlreadyExistsException;
import com.restly.restly_backend.category.exception.CategoryNotFoundException;
import com.restly.restly_backend.category.repository.ICategoryRepository;
import com.restly.restly_backend.category.service.ICategoryService;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements ICategoryService {

    private final ICategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(category -> {
                    CategoryDTO dto = modelMapper.map(category, CategoryDTO.class);
                    dto.setTotalProducts((long) category.getProducts().size());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public Optional<CategoryDTO> getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .map(category -> {
                    CategoryDTO dto = modelMapper.map(category, CategoryDTO.class);
                    dto.setTotalProducts((long) category.getProducts().size());
                    return dto;
                });
    }

    @Override
    @Transactional
    public CategoryDTO saveCategory(CategoryDTO categoryDTO) {
        if (categoryRepository.findByName(categoryDTO.getName()).isPresent()) {
            throw new CategoryAlreadyExistsException("Ya existe una categoría con el nombre '" + categoryDTO.getName() + "'.");
        }

        Category category = modelMapper.map(categoryDTO, Category.class);
        Category savedCategory = categoryRepository.save(category);
        return modelMapper.map(savedCategory, CategoryDTO.class);
    }


    @Override
    @Transactional
    public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Categoría con ID " + id + " no encontrada."));

        existingCategory.setName(categoryDTO.getName());
        existingCategory.setDescription(categoryDTO.getDescription());
        existingCategory.setImageUrl(categoryDTO.getImageUrl());

        Category updatedCategory = categoryRepository.save(existingCategory);

        CategoryDTO updatedDTO = modelMapper.map(updatedCategory, CategoryDTO.class);
        updatedDTO.setTotalProducts((long) updatedCategory.getProducts().size());

        return updatedDTO;
    }


    @Override
    @Transactional
    public String deleteCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Categoría con ID " + id + " no encontrada."));

        categoryRepository.delete(category);
        return "Categoría eliminada correctamente.";
    }


    @Override
    public Category getCategory(String categoryName) {
        Optional<Category> categoryOptional = categoryRepository.findByName(categoryName);
        Category category = categoryOptional.orElseGet(() -> {
            Category newCategory = new Category();
            newCategory.setName(categoryName);
            return categoryRepository.save(newCategory);
        });
        return category;
    }
}



