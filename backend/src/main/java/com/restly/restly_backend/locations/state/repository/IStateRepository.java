package com.restly.restly_backend.locations.state.repository;

import com.restly.restly_backend.locations.country.entity.Country;
import com.restly.restly_backend.locations.state.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IStateRepository extends JpaRepository<State, Long> {
    Optional<State> findByName(String name);
    Optional<State> findByNameAndCountry(String name, Country country);

    @Query("SELECT DISTINCT s.name FROM State s WHERE LOWER(s.name) LIKE LOWER(CONCAT(:query, '%'))")
    List<String> findStateNames(@Param("query") String query);
}

