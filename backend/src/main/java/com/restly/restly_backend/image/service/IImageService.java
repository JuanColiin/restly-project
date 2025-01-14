package com.restly.restly_backend.image.service;


import com.restly.restly_backend.image.dto.ImageDTO;

import java.util.List;
import java.util.Optional;


public interface IImageService {
    List<ImageDTO> getAllImages();
    Optional<ImageDTO> getImageById(Long id);
    List<ImageDTO> getImagesByProductId(Long productId);
    ImageDTO saveImage(ImageDTO imageDTO);
    ImageDTO updateImage(Long id, ImageDTO imageDTO);
    String deleteImageById(Long id);
}
