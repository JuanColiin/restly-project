package com.restly.restly_backend.favorites.service.impl;

import com.restly.restly_backend.favorites.dto.FavoriteDTO;
import com.restly.restly_backend.favorites.entity.Favorite;
import com.restly.restly_backend.favorites.repository.FavoriteRepository;
import com.restly.restly_backend.favorites.service.IFavoriteService;
import com.restly.restly_backend.image.dto.ImageDTO;
import com.restly.restly_backend.product.entity.Product;
import com.restly.restly_backend.product.repository.IProductRepository;
import com.restly.restly_backend.security.entity.User;
import com.restly.restly_backend.security.repository.IUserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements IFavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final IUserRepository userRepository;
    private final IProductRepository productRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public void addFavorite(User user, Product product) {
        if (favoriteRepository.findByUserAndProduct(user, product).isPresent()) {
            throw new IllegalStateException("El producto ya está en favoritos.");
        }
        Favorite favorite = new Favorite(null, user, product);
        favoriteRepository.save(favorite);
    }

    @Override
    @Transactional
    public void removeFavorite(User user, Product product) {
        Favorite favorite = favoriteRepository.findByUserAndProduct(user, product)
                .orElseThrow(() -> new EntityNotFoundException("El producto no está en favoritos."));
        favoriteRepository.delete(favorite);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FavoriteDTO> getUserFavorites(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado."));

        return favoriteRepository.findByUser(user)
                .stream()
                .map(favorite -> {
                    Product product = favorite.getProduct();
                    return new FavoriteDTO(
                            product.getId(),
                            product.getTitle(),
                            product.getAddress() != null
                                    ? product.getAddress().getCity().getName() + ", "
                                    + product.getAddress().getCity().getState().getName() + ", "
                                    + product.getAddress().getCity().getState().getCountry().getName()
                                    : "Ubicación no disponible",
                            product.getShortDescription(),
                            product.getCategory() != null ? product.getCategory().getName() : "Sin categoría",
                            product.getCategory() != null ? product.getCategory().getImageUrl() : null,
                            product.getImages() != null ? product.getImages().stream().map(ImageDTO::new).toList() : List.of(),
                            true,
                            user.getId(),
                            user.getFirstname() + " " + user.getLastname()
                    );
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FavoriteDTO> getFavoritesByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado."));

        return favoriteRepository.findByUser(user)
                .stream()
                .map(favorite -> {
                    Product product = favorite.getProduct();
                    return new FavoriteDTO(
                            product.getId(),
                            product.getTitle(),
                            product.getAddress() != null
                                    ? product.getAddress().getCity().getName() + ", "
                                    + product.getAddress().getCity().getState().getName() + ", "
                                    + product.getAddress().getCity().getState().getCountry().getName()
                                    : "Ubicación no disponible",
                            product.getShortDescription(),
                            product.getCategory() != null ? product.getCategory().getName() : "Sin categoría",
                            product.getCategory() != null ? product.getCategory().getImageUrl() : null,
                            product.getImages() != null ? product.getImages().stream().map(ImageDTO::new).toList() : List.of(),
                            true,
                            user.getId(),
                            user.getFirstname() + " " + user.getLastname()
                    );
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FavoriteDTO> getMyFavorites(User user) {
        return getUserFavorites(user.getId());
    }




    @Override
    public boolean isProductFavorite(User user, Product product) {
        return favoriteRepository.findByUserAndProduct(user, product).isPresent();
    }
}