package com.restly.restly_backend.product.controller;

import com.restly.restly_backend.category.entity.Category;
import com.restly.restly_backend.locations.city.entity.City;
import com.restly.restly_backend.product.entity.Product;
import com.restly.restly_backend.product.service.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProductController {

    private final IProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> listarProductos() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> buscarProducto(@PathVariable Long id) {
        Optional<Product> productoBuscado = productService.getProductById(id);
        return productoBuscado
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null));  // Devuelve 404 con null si no se encuentra el producto
    }

    @GetMapping("/category/{id}")
    public ResponseEntity<List<Product>> buscarProductoPorCategoria(@PathVariable Category id) {
        List<Product> productos = productService.getProductsByCategory(id);
        return productos.isEmpty()
                ? ResponseEntity.status(HttpStatus.NOT_FOUND).build()
                : ResponseEntity.ok(productos);
    }

    @PostMapping("/create")
    public ResponseEntity<Product> crearProducto(@RequestBody Product product) {
        Product productoCreado = productService.saveProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(productoCreado);  // 201 Created
    }

    @PutMapping("/update")
    public ResponseEntity<Product> editarProducto(@RequestBody Product product) {
        Optional<Product> productoBuscado = productService.getProductById(product.getId());
        return productoBuscado.isPresent()
                ? ResponseEntity.ok(productService.updateProduct(product))
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // 404 if not found
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> eliminarProducto(@PathVariable Long id) {
        if (productService.getProductById(id).isPresent()) {
            productService.deleteProductById(id);
            return ResponseEntity.ok("Producto con ID " + id + " eliminado con éxito.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Producto no encontrado con ID " + id);
    }

    @GetMapping("/city/{id}")
    public ResponseEntity<List<Product>> buscarProductoPorCiudad(@PathVariable City id) {
        List<Product> productos = productService.getProductsByCity(id);
        return productos.isEmpty()
                ? ResponseEntity.status(HttpStatus.NOT_FOUND).build()
                : ResponseEntity.ok(productos);
    }

    @GetMapping("/dates/{startDate}/{endDate}")
    public ResponseEntity<List<Product>> buscarProductosPorRangoFechas(
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        List<Product> productos = productService.getProductsByRangeDate(startDate, endDate);
        return productos.isEmpty()
                ? ResponseEntity.status(HttpStatus.NOT_FOUND).build()
                : ResponseEntity.ok(productos);
    }

    @GetMapping("/cityAndDates/{cityId}/{startDate}/{endDate}")
    public ResponseEntity<List<Product>> buscarProductosPorCiudadYFechas(
            @PathVariable Integer cityId,
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        List<Product> productos = productService.getProductsByCityAndRangeDate(cityId, startDate, endDate);
        return productos.isEmpty()
                ? ResponseEntity.status(HttpStatus.NOT_FOUND).build()
                : ResponseEntity.ok(productos);
    }

    @GetMapping("findAll/random")
    public ResponseEntity<List<Product>> obtenerProductosAleatorios() {
        return ResponseEntity.ok(productService.getRandomProduct());
    }
}


