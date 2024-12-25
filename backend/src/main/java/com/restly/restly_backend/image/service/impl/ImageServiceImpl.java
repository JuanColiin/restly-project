package com.restly.restly_backend.image.service.impl;

import com.restly.restly_backend.image.entity.Image;
import com.restly.restly_backend.image.repository.IImageRepository;
import com.restly.restly_backend.image.service.IImageService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements IImageService {

    private final IImageRepository imageRepository;

    @Override
    public List<Image> getAllImages() {
        return imageRepository.findAll();
    }

    @Override
    public Optional<Image> getImageById(Long id) {
        return imageRepository.findById(id);
    }

    @Override
    public List<Image> getImagesByProductId(Long productId) {
        return imageRepository.findByProductId(productId);
    }

    @Override
    @Transactional
    public Image saveImage(Image image) {
        if (image == null || image.getImageUrl() == null || image.getImageUrl().trim().isEmpty()) {
            throw new IllegalArgumentException("La URL de la imagen no puede ser nula ni vacía");
        }
        return imageRepository.save(image);
    }

    @Override
    @Transactional
    public Image updateImage(Image image) {
        if (image == null || image.getId() == null) {
            throw new IllegalArgumentException("Debe proporcionar una imagen y su ID para actualizar");
        }

        Optional<Image> existingImage = imageRepository.findById(image.getId());
        if (existingImage.isEmpty()) {
            throw new RuntimeException("Imagen con ID " + image.getId() + " no encontrada para actualizar");
        }

        existingImage.get().setTitle(image.getTitle());
        existingImage.get().setImageUrl(image.getImageUrl());
        existingImage.get().setProduct(image.getProduct());

        return imageRepository.save(existingImage.get());
    }

    @Override
    @Transactional
    public String deleteImageById(Long id) {
        Optional<Image> existingImage = imageRepository.findById(id);
        if (existingImage.isEmpty()) {
            throw new RuntimeException("Imagen con ID " + id + " no encontrada para eliminar");
        }

        imageRepository.deleteById(id);
        return "La imagen con ID " + id + " ha sido eliminada correctamente.";
    }
}
