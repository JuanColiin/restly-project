package com.restly.restly_backend.locations.city.service;

import com.restly.restly_backend.locations.city.dto.CityDTO;
import com.restly.restly_backend.locations.city.entity.City;
import com.restly.restly_backend.locations.state.entity.State;

import java.util.List;
import java.util.Optional;

import java.util.List;
import java.util.Optional;

public interface ICityService {

    List<CityDTO> getAllCities();
    Optional<CityDTO> getCityById(Long id);
    Optional<CityDTO> getCityByName(String name);
    City saveCity(City city);
    CityDTO updateCity(Long id, City city);
    String deleteCityById(Long id);
    Optional<City> getCityByNameAndState(String name, State state);
}
