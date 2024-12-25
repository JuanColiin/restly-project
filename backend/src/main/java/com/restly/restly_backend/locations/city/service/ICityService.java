package com.restly.restly_backend.locations.city.service;

import com.restly.restly_backend.locations.city.entity.City;

import java.util.List;
import java.util.Optional;

public interface ICityService {

    List<City> getAllCities();
    Optional<City> getCityById(Long id);

    Optional<City> getCityByName(String name);

    City saveCity(City city);

    City updateCity(City city);
    String deleteCityById(Long id);

}
