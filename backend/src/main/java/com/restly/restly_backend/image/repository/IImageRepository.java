package com.restly.restly_backend.image.repository;

import com.restly.restly_backend.image.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IImageRepository extends JpaRepository<Image, Long> {
    List<Image> findByProductId(Long productId);
}
