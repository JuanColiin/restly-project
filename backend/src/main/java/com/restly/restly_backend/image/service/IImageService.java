package com.restly.restly_backend.image.service;

import com.restly.restly_backend.image.entity.Image;

import java.util.List;
import java.util.Optional;

public interface IImageService {
    List<Image> getAllImages();
    Optional<Image> getImageById(Long id);
    List<Image> getImagesByProductId(Long productId);
    Image saveImage(Image image);
    Image updateImage(Image image);
    String deleteImageById(Long id);
}
