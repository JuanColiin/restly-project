package com.restly.restly_backend.locations.country.service;

import com.restly.restly_backend.locations.country.dto.CountryDTO;
import com.restly.restly_backend.locations.country.entity.Country;

import java.util.List;
import java.util.Optional;

public interface ICountryService {
    List<CountryDTO> getAllCountries();
    Optional<CountryDTO> getCountryById(Long id);
    Optional<CountryDTO> getCountryByName(String name);
    CountryDTO saveCountry(CountryDTO countryDTO);
    CountryDTO updateCountry(CountryDTO countryDTO);
    String deleteCountryById(Long id);
}
