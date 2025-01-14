package com.restly.restly_backend.product.service;

import com.restly.restly_backend.product.dto.ProductDTO;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;



public interface IProductService {

    List<ProductDTO> getAllProducts();
    Optional<ProductDTO> getProductById(Long id);
    List<ProductDTO> getProductsByCategory(Long categoryId);
    ProductDTO saveProduct(ProductDTO productDTO);
    ProductDTO updateProduct(Long id, ProductDTO productDTO);
    void deleteProductById(Long id);
    List<ProductDTO> getProductsByCity(Long cityId);
    List<ProductDTO> getProductsByRangeDate(LocalDate checkInDate, LocalDate checkOutDate);
    List<ProductDTO> getProductsByCityAndRangeDate(Long cityId, LocalDate checkInDate, LocalDate checkOutDate);
    List<ProductDTO> getRandomProduct();
}

