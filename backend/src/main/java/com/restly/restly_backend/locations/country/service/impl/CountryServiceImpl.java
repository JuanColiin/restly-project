package com.restly.restly_backend.locations.country.service.impl;

import com.restly.restly_backend.locations.country.entity.Country;
import com.restly.restly_backend.locations.country.repository.ICountryRepository;
import com.restly.restly_backend.locations.country.service.ICountryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CountryServiceImpl implements ICountryService {

    private final ICountryRepository countryRepository;

    @Override
    public List<Country> getAllCountries() {
        return countryRepository.findAll();
    }

    @Override
    public Optional<Country> getCountryById(Long id) {
        return countryRepository.findById(id);
    }

    @Override
    public Optional<Country> getCountryByName(String name) {
        return countryRepository.findByName(name);
    }

    @Override
    @Transactional
    public Country saveCountry(Country country) {
        if (country.getName() == null || country.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del país no puede ser nulo ni vacío");
        }

        // Guardar el país en la base de datos
        Country savedCountry = countryRepository.save(country);

        // Verificar si se ha guardado correctamente
        if (savedCountry != null) {
            return savedCountry;
        } else {
            throw new RuntimeException("Error al guardar el país en la base de datos.");
        }
    }

    @Override
    @Transactional
    public Country updateCountry(Country country) {
        if (country == null || country.getId() == null) {
            throw new IllegalArgumentException("Debe proporcionar un país y su ID para actualizar.");
        }

        Optional<Country> existingCountry = countryRepository.findById(country.getId());
        if (existingCountry.isEmpty()) {
            throw new RuntimeException("País con ID " + country.getId() + " no encontrado para actualizar.");
        }

        Country updatedCountry = existingCountry.get();
        updatedCountry.setName(country.getName());
        updatedCountry.setStates(country.getStates());

        return countryRepository.save(updatedCountry);
    }

    @Override
    @Transactional
    public String deleteCountryById(Long id) {
        Optional<Country> existingCountry = countryRepository.findById(id);
        if (existingCountry.isEmpty()) {
            throw new RuntimeException("País con ID " + id + " no encontrado para eliminar.");
        }

        countryRepository.deleteById(id);
        return "El país con ID " + id + " ha sido eliminado correctamente.";
    }
}
