package com.restly.restly_backend.category.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice(basePackages = "com.restly.restly_backend.category")
public class CategoryExceptionHandler {
    @ExceptionHandler(CategoryAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleCategoryAlreadyExistsException(CategoryAlreadyExistsException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", ex.getMessage()));
    }
}
