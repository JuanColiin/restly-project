package com.restly.restly_backend.config;

import com.restly.restly_backend.policies.entity.Policy;
import com.restly.restly_backend.product.dto.ProductDTO;
import com.restly.restly_backend.product.entity.Product;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();


        return modelMapper;
    }
}


