package com.restly.restly_backend.locations.country.service.impl;

import com.restly.restly_backend.locations.country.dto.CountryDTO;
import com.restly.restly_backend.locations.country.entity.Country;
import com.restly.restly_backend.locations.country.repository.ICountryRepository;
import com.restly.restly_backend.locations.country.service.ICountryService;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class CountryServiceImpl implements ICountryService {

    private final ICountryRepository countryRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<CountryDTO> getAllCountries() {
        List<Country> countries = countryRepository.findAll();
        return countries.stream()
                .map(country -> modelMapper.map(country, CountryDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<CountryDTO> getCountryById(Long id) {
        Optional<Country> country = countryRepository.findById(id);
        return country.map(c -> modelMapper.map(c, CountryDTO.class));
    }

    @Override
    public Optional<CountryDTO> getCountryByName(String name) {
        Optional<Country> country = countryRepository.findByName(name);
        return country.map(c -> modelMapper.map(c, CountryDTO.class));
    }

    @Override
    public CountryDTO saveCountry(CountryDTO countryDTO) {
        // Convertimos el DTO a la entidad Country
        Country country = modelMapper.map(countryDTO, Country.class);
        Country savedCountry = countryRepository.save(country);
        return modelMapper.map(savedCountry, CountryDTO.class);
    }

    @Override
    public CountryDTO updateCountry(CountryDTO countryDTO) {
        Optional<Country> existingCountry = countryRepository.findByName(countryDTO.getName());
        if (existingCountry.isPresent()) {
            Country country = existingCountry.get();
            modelMapper.map(countryDTO, country);
            countryRepository.save(country);
            return modelMapper.map(country, CountryDTO.class);
        }
        return null;
    }

    @Override
    public String deleteCountryById(Long id) {
        Optional<Country> existingCountry = countryRepository.findById(id);
        if (existingCountry.isPresent()) {
            countryRepository.deleteById(id);
            return "Country with ID " + id + " was successfully deleted.";
        }
        return "Country with ID " + id + " not found.";
    }
}
