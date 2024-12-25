package com.restly.restly_backend.locations.country.service;

import com.restly.restly_backend.locations.country.entity.Country;

import java.util.List;
import java.util.Optional;

public interface ICountryService {
    List<Country> getAllCountries();
    Optional<Country> getCountryById(Long id);
    Optional<Country> getCountryByName(String name);
    Country saveCountry(Country country);
    Country updateCountry(Country country);
    String deleteCountryById(Long id);
}
