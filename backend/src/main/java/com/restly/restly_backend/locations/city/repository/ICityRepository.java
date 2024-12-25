package com.restly.restly_backend.locations.city.repository;

import com.restly.restly_backend.locations.city.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ICityRepository extends JpaRepository<City, Long> {
    Optional<City> findByName(String name);
}
