package com.restly.restly_backend.locations.city.repository;

import com.restly.restly_backend.locations.city.entity.City;
import com.restly.restly_backend.locations.state.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface ICityRepository extends JpaRepository<City, Long> {
    Optional<City> findByName(String name);
    Optional<City> findByNameAndState(String name, State state);


    @Query("SELECT DISTINCT c.name FROM City c WHERE LOWER(c.name) LIKE LOWER(CONCAT(:query, '%'))")
    List<String> findCityNames(@Param("query") String query);

}
