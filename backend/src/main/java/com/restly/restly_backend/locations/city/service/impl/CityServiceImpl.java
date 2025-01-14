package com.restly.restly_backend.locations.city.service.impl;

import com.restly.restly_backend.locations.city.dto.CityDTO;
import com.restly.restly_backend.locations.city.entity.City;
import com.restly.restly_backend.locations.city.repository.ICityRepository;
import com.restly.restly_backend.locations.city.service.ICityService;
import com.restly.restly_backend.locations.state.dto.StateDTO;
import com.restly.restly_backend.locations.state.entity.State;
import com.restly.restly_backend.locations.state.service.IStateService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class CityServiceImpl implements ICityService {

    private final ICityRepository cityRepository;
    private final IStateService stateService;
    private final ModelMapper modelMapper;

    @Override
    public List<CityDTO> getAllCities() {
        List<City> cities = cityRepository.findAll();
        return cities.stream()
                .map(city -> modelMapper.map(city, CityDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<CityDTO> getCityById(Long id) {
        Optional<City> city = cityRepository.findById(id);
        return city.map(value -> modelMapper.map(value, CityDTO.class));
    }

    @Override
    public Optional<CityDTO> getCityByName(String name) {
        Optional<City> city = cityRepository.findByName(name);
        return city.map(value -> modelMapper.map(value, CityDTO.class));
    }

    @Override
    public City saveCity(City city) {
        // Obtener el estado desde el servicio usando el nombre
        StateDTO stateDTO = stateService.getStateByName(city.getState().getName())
                .orElseThrow(() -> new RuntimeException("Estado no encontrado: " + city.getState().getName()));

        // Convertir el DTO del estado a la entidad State
        State state = modelMapper.map(stateDTO, State.class);

        // Asociamos el estado a la ciudad
        city.setState(state);

        // Guardar la ciudad
        City savedCity = cityRepository.save(city);
        return savedCity;
    }

    @Override
    public CityDTO updateCity(Long id, City city) {
        Optional<City> existingCity = cityRepository.findById(id);
        if (existingCity.isPresent()) {
            City updatedCity = existingCity.get();
            // Mapeamos las propiedades de city a la ciudad existente
            modelMapper.map(city, updatedCity);

            // Actualizamos el estado si es necesario
            if (city.getState() != null) {
                StateDTO stateDTO = stateService.getStateByName(city.getState().getName())
                        .orElseThrow(() -> new RuntimeException("Estado no encontrado: " + city.getState().getName()));
                updatedCity.setState(modelMapper.map(stateDTO, State.class));
            }

            // Guardamos la ciudad actualizada
            cityRepository.save(updatedCity);
            return modelMapper.map(updatedCity, CityDTO.class);
        }
        return null;
    }

    @Override
    public String deleteCityById(Long id) {
        Optional<City> existingCity = cityRepository.findById(id);
        if (existingCity.isPresent()) {
            cityRepository.deleteById(id);
            return "Ciudad con ID " + id + " eliminada correctamente";
        }
        return "Ciudad no encontrada con ID " + id;
    }

    @Override
    public Optional<City> getCityByNameAndState(String name, State state) {
        return cityRepository.findByNameAndState(name, state);
    }
}



