package com.restly.restly_backend.locations.country.repository;

import com.restly.restly_backend.locations.country.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ICountryRepository extends JpaRepository<Country, Long> {
    Optional<Country> findByName(String name);

    @Query("SELECT DISTINCT c.name FROM Country c WHERE LOWER(c.name) LIKE LOWER(CONCAT(:query, '%'))")
    List<String> findCountryNames(@Param("query") String query);
}
