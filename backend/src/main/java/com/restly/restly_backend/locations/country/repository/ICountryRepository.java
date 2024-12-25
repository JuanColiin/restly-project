package com.restly.restly_backend.locations.country.repository;

import com.restly.restly_backend.locations.country.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ICountryRepository extends JpaRepository<Country, Long> {
    Optional<Country> findByName(String name);
}
