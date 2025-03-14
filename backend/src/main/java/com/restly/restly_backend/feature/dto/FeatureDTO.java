package com.restly.restly_backend.feature.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FeatureDTO {
    private Long id;
    private String title;
    private String icon;
}
