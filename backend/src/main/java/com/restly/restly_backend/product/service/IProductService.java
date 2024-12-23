package com.restly.restly_backend.product.service;

import com.restly.restly_backend.category.entity.Category;
import com.restly.restly_backend.locations.city.entity.City;
import com.restly.restly_backend.product.entity.Product;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IProductService {
    List<Product> getAllProducts();
    Optional<Product> getProductById(Long id);
    List<Product>getProductsByCategory(Category category);
    Product saveProduct(Product product);
    Product updateProduct(Product product);
    void deleteProductById(Long id);
    List<Product>getProductsByCity(City city);
    List<Product> getProductsByRangeDate(LocalDate check_in_date, LocalDate check_out_date);
    List<Product> getProductsByCityAndRangeDate(Integer city_id, LocalDate check_in_date, LocalDate check_out_date);

    List<Product> getRandomProduct();
}
