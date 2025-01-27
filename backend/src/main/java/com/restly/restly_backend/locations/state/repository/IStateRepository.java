package com.restly.restly_backend.locations.state.repository;

import com.restly.restly_backend.locations.country.entity.Country;
import com.restly.restly_backend.locations.state.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IStateRepository extends JpaRepository<State, Long> {
    Optional<State> findByName(String name);
    Optional<State> findByNameAndCountry(String name, Country country);


}

