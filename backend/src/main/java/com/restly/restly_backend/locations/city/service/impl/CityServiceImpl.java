package com.restly.restly_backend.locations.city.service.impl;

import com.restly.restly_backend.locations.city.entity.City;
import com.restly.restly_backend.locations.city.repository.ICityRepository;
import com.restly.restly_backend.locations.city.service.ICityService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CityServiceImpl implements ICityService {

    private final ICityRepository cityRepository;

    @Override
    public List<City> getAllCities() {
        return cityRepository.findAll();
    }

    @Override
    public Optional<City> getCityById(Long id) {
        return cityRepository.findById(id);
    }

    @Override
    public Optional<City> getCityByName(String name) {
        return cityRepository.findByName(name);
    }

    @Override
    @Transactional
    public City saveCity(City city) {
        if (city == null || city.getName() == null || city.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la ciudad no puede ser nulo ni vacío");
        }
        return cityRepository.save(city);
    }

    @Override
    @Transactional
    public City updateCity(City city) {
        if (city == null || city.getId() == null) {
            throw new IllegalArgumentException("Debe proporcionar una ciudad y su ID para actualizar");
        }

        Optional<City> existingCity = cityRepository.findById(city.getId());
        if (existingCity.isEmpty()) {
            throw new RuntimeException("Ciudad con ID " + city.getId() + " no encontrada para actualizar");
        }

        // Actualizar la ciudad con los nuevos valores, por ejemplo, el nombre
        existingCity.get().setName(city.getName());

        return cityRepository.save(existingCity.get());
    }

    @Override
    @Transactional
    public String deleteCityById(Long id) {
        Optional<City> existingCity = cityRepository.findById(id);
        if (existingCity.isEmpty()) {
            throw new RuntimeException("Ciudad con ID " + id + " no encontrada para eliminar");
        }

        cityRepository.deleteById(id);
        return "La ciudad con ID " + id + " ha sido eliminada correctamente.";
    }
}
