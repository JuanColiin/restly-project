package com.restly.restly_backend.category.exception;

public class CategoryNotFoundException extends RuntimeException {
    public CategoryNotFoundException(String message) {
        super("Categoría no encontrada: " + message);
    }
}
