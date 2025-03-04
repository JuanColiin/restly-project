package com.restly.restly_backend.product.exception;

public class NoProductsInCategoryException extends RuntimeException {
    public NoProductsInCategoryException(String message) {
        super(message);
    }
}