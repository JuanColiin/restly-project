package com.restly.restly_backend.image.controller;

import com.restly.restly_backend.image.dto.ImageDTO;
import com.restly.restly_backend.image.service.IImageService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
public class ImageController {

    private final IImageService imageService;

    @GetMapping
    public ResponseEntity<List<ImageDTO>> getAllImages() {
        List<ImageDTO> images = imageService.getAllImages();
        return ResponseEntity.ok(images);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getImageById(@PathVariable Long id) {
        try {
            Optional<ImageDTO> image = imageService.getImageById(id);
            if (image.isPresent()) {
                return ResponseEntity.ok(image.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Imagen con ID " + id + " no encontrada");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener la imagen: " + e.getMessage());
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getImagesByProductId(@PathVariable Long productId) {
        try {
            List<ImageDTO> images = imageService.getImagesByProductId(productId);
            if (images.isEmpty()) {
                return new ResponseEntity<>("No se encontraron imágenes para el producto con ID " + productId, HttpStatus.NOT_FOUND);
            }
            return ResponseEntity.ok(images);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al obtener las imágenes: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<?> saveImage(@Valid @RequestBody ImageDTO imageDTO) {
        try {
            ImageDTO savedImage = imageService.saveImage(imageDTO);
            return new ResponseEntity<>(savedImage, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Datos de la imagen no válidos: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al guardar la imagen: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateImage(@PathVariable Long id, @Valid @RequestBody ImageDTO imageDTO) {
        try {
            ImageDTO updatedImage = imageService.updateImage(id, imageDTO);
            return ResponseEntity.ok(updatedImage);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Imagen con ID " + id + " no encontrada", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al actualizar la imagen: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteImageById(@PathVariable Long id) {
        try {
            String response = imageService.deleteImageById(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Imagen con ID " + id + " no encontrada", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al eliminar la imagen: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
