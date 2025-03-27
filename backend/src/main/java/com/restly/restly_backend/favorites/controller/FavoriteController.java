package com.restly.restly_backend.favorites.controller;

import com.restly.restly_backend.favorites.dto.FavoriteDTO;
import com.restly.restly_backend.favorites.service.IFavoriteService;
import com.restly.restly_backend.product.entity.Product;
import com.restly.restly_backend.product.repository.IProductRepository;
import com.restly.restly_backend.security.entity.User;
import com.restly.restly_backend.security.repository.IUserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final IFavoriteService favoriteService;
    private final IProductRepository productRepository;
    private final IUserRepository userRepository;

    @PostMapping("/{productId}")
    public ResponseEntity<String> addFavorite(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado."));

        favoriteService.addFavorite(user, product);
        return ResponseEntity.ok("Producto agregado a favoritos.");
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<String> removeFavorite(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado."));

        favoriteService.removeFavorite(user, product);
        return ResponseEntity.ok("Producto eliminado de favoritos.");
    }

    @GetMapping("/my-favorites")
    public ResponseEntity<List<FavoriteDTO>> getMyFavorites(@AuthenticationPrincipal User user) {
        List<FavoriteDTO> favorites = favoriteService.getMyFavorites(user);
        return ResponseEntity.ok(favorites);
    }


    @GetMapping
    public ResponseEntity<List<FavoriteDTO>> getUserFavorites(@AuthenticationPrincipal User user) {
        List<FavoriteDTO> favorites = favoriteService.getUserFavorites(user.getId());
        return ResponseEntity.ok(favorites);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FavoriteDTO>> getFavoritesByUserId(@PathVariable Long userId) {
        List<FavoriteDTO> favorites = favoriteService.getFavoritesByUserId(userId);
        return ResponseEntity.ok(favorites);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<Boolean> isProductFavorite(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado."));

        boolean isFavorite = favoriteService.isProductFavorite(user, product);
        return ResponseEntity.ok(isFavorite);
    }
}