package com.restly.restly_backend.product.controller;


import com.restly.restly_backend.product.dto.ProductDTO;
import com.restly.restly_backend.product.exception.ProductNotFoundException;
import com.restly.restly_backend.product.service.impl.ProductServiceImpl;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductServiceImpl productService;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<ProductDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        ProductDTO product = productService.getProductById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado."));
        return ResponseEntity.ok(product);
    }

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ProductDTO> saveProduct(@RequestBody ProductDTO productDTO) {
        ProductDTO savedProduct = productService.saveProduct(productDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO) {
        ProductDTO updatedProduct = productService.updateProduct(id, productDTO);
        return ResponseEntity.ok(updatedProduct);
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProductById(id);
            return ResponseEntity.noContent().build(); // 204 No Content si la eliminación es exitosa
        } catch (ProductNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Producto no encontrado.");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }


    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductDTO>> getProductsByCategory(@PathVariable Long categoryId) {
        List<ProductDTO> products = productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(@RequestParam String keyword) {
        return ResponseEntity.ok(productService.searchProductsByKeyword(keyword));
    }

    @GetMapping("/city/{cityId}")
    public ResponseEntity<List<ProductDTO>> getProductsByCity(@PathVariable Long cityId) {
        return ResponseEntity.ok(productService.getProductsByCity(cityId));
    }

    @GetMapping("/availability")
    public ResponseEntity<List<ProductDTO>> getAvailableProducts(
            @RequestParam("checkIn") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam("checkOut") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {

        List<ProductDTO> availableProducts = productService.getAvailableProducts(checkIn, checkOut);
        return ResponseEntity.ok(availableProducts);
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getSuggestions(@RequestParam String query) {
        System.out.println("Query recibido: " + query);
        List<String> suggestions = productService.getSuggestions(query);
        System.out.println("Sugerencias encontradas: " + suggestions);
        return ResponseEntity.ok(suggestions);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<ProductDTO>> filterProducts(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {

        List<ProductDTO> filteredProducts;

        if (location != null && !location.trim().isEmpty() && checkIn != null && checkOut != null) {
            // Filtrar por ubicación y disponibilidad
            filteredProducts = productService.getProductsByLocationAndAvailability(location, checkIn, checkOut);
        } else if (checkIn != null && checkOut != null) {
            // Filtrar solo por disponibilidad
            filteredProducts = productService.getProductsByAvailability(checkIn, checkOut);
        } else if (location != null && !location.trim().isEmpty()) {
            // Filtrar solo por ubicación
            filteredProducts = productService.getProductsByCityName(location);
        } else {
            // Si no se pasan parámetros, devolver todos los productos
            filteredProducts = productService.getAllProducts();
        }

        return ResponseEntity.ok(filteredProducts);
    }


}



