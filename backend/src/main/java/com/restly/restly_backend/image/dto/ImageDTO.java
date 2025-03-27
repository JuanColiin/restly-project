package com.restly.restly_backend.image.dto;

import com.restly.restly_backend.image.entity.Image;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImageDTO {

    private String title;
    private String imageUrl;

    public ImageDTO(Image image) {
        this.title = image.getTitle();
        this.imageUrl = image.getImageUrl();
    }
}
