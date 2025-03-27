package com.restly.restly_backend.favorites.dto;


import com.restly.restly_backend.image.dto.ImageDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteDTO {
    private Long id;
    private String title;
    private String location;
    private String shortDescription;
    private String categoryName;
    private String categoryImageUrl;
    private List<ImageDTO> images;
    private boolean isFavorite;
    private Long userId;
    private String userName;
}
