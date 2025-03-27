package com.restly.restly_backend.favorites.service;

import com.restly.restly_backend.favorites.dto.FavoriteDTO;

import com.restly.restly_backend.product.entity.Product;
import com.restly.restly_backend.security.entity.User;

import java.util.List;


public interface IFavoriteService {

    void addFavorite(User user, Product product);

    void removeFavorite(User user, Product product);

    List<FavoriteDTO> getUserFavorites(Long userId);

    boolean isProductFavorite(User user, Product product);

    List<FavoriteDTO> getFavoritesByUserId(Long userId);

    List<FavoriteDTO> getMyFavorites(User user);
}
