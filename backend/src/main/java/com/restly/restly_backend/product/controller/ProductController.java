package com.restly.restly_backend.product.controller;


import com.restly.restly_backend.product.dto.ProductDTO;
import com.restly.restly_backend.product.service.impl.ProductServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.time.LocalDate;
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
    public ResponseEntity<ProductDTO> saveProduct(@RequestBody ProductDTO productDTO) {
        ProductDTO savedProduct = productService.saveProduct(productDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO) {
        ProductDTO updatedProduct = productService.updateProduct(id, productDTO);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProductById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductDTO>> getProductsByCategory(@PathVariable Long categoryId) {
        List<ProductDTO> products = productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/city/{cityId}")
    public ResponseEntity<List<ProductDTO>> getProductsByCity(@PathVariable Long cityId) {
        List<ProductDTO> products = productService.getProductsByCity(cityId);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/range")
    public ResponseEntity<List<ProductDTO>> getProductsByRangeDate(
            @RequestParam LocalDate startDate, @RequestParam LocalDate endDate) {
        List<ProductDTO> products = productService.getProductsByRangeDate(startDate, endDate);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/city/{cityId}/range")
    public ResponseEntity<List<ProductDTO>> getProductsByCityAndRangeDate(
            @PathVariable Long cityId, @RequestParam LocalDate startDate, @RequestParam LocalDate endDate) {
        List<ProductDTO> products = productService.getProductsByCityAndRangeDate(cityId, startDate, endDate);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/random")
    public ResponseEntity<List<ProductDTO>> getRandomProduct() {
        List<ProductDTO> products = productService.getRandomProduct();
        return ResponseEntity.ok(products);
    }
}



