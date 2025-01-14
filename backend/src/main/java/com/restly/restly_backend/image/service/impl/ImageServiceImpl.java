package com.restly.restly_backend.image.service.impl;

import com.restly.restly_backend.image.dto.ImageDTO;
import com.restly.restly_backend.image.entity.Image;
import com.restly.restly_backend.image.repository.IImageRepository;
import com.restly.restly_backend.image.service.IImageService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements IImageService {

    private final IImageRepository imageRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<ImageDTO> getAllImages() {
        return imageRepository.findAll()
                .stream()
                .map(image -> modelMapper.map(image, ImageDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ImageDTO> getImageById(Long id) {
        return imageRepository.findById(id)
                .map(image -> modelMapper.map(image, ImageDTO.class));
    }

    @Override
    public List<ImageDTO> getImagesByProductId(Long productId) {
        return imageRepository.findByProductId(productId)
                .stream()
                .map(image -> modelMapper.map(image, ImageDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ImageDTO saveImage(ImageDTO imageDTO) {
        if (imageDTO.getImageUrl() == null || imageDTO.getImageUrl().trim().isEmpty()) {
            throw new IllegalArgumentException("La URL de la imagen no puede ser nula ni vacía.");
        }
        Image image = modelMapper.map(imageDTO, Image.class);
        Image savedImage = imageRepository.save(image);
        return modelMapper.map(savedImage, ImageDTO.class);
    }

    @Override
    @Transactional
    public ImageDTO updateImage(Long id, ImageDTO imageDTO) {
        Image image = imageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Imagen con ID " + id + " no encontrada"));

        modelMapper.map(imageDTO, image);  // Mapea los datos de DTO a la entidad
        Image updatedImage = imageRepository.save(image);
        return modelMapper.map(updatedImage, ImageDTO.class);
    }

    @Override
    @Transactional
    public String deleteImageById(Long id) {
        if (!imageRepository.existsById(id)) {
            throw new RuntimeException("Imagen con ID " + id + " no encontrada para eliminar.");
        }
        imageRepository.deleteById(id);
        return "Imagen con ID " + id + " eliminada correctamente.";
    }
}

