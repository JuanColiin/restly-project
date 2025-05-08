package com.restly.restly_backend.locations.city.controller;

import com.restly.restly_backend.locations.city.dto.CityDTO;
import com.restly.restly_backend.locations.city.entity.City;
import com.restly.restly_backend.locations.city.service.ICityService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/cities")
@RequiredArgsConstructor
public class CityController {

    private final ICityService cityService;
    private final ModelMapper modelMapper;

    @GetMapping
    public ResponseEntity<List<CityDTO>> getAllCities() {
        List<CityDTO> cities = cityService.getAllCities();
        if (cities.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(cities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CityDTO> getCityById(@PathVariable Long id) {
        Optional<CityDTO> cityDTO = cityService.getCityById(id);
        return cityDTO.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @PostMapping
    public ResponseEntity<CityDTO> createCity(@RequestBody CityDTO cityDTO) {
        try {
            City city = modelMapper.map(cityDTO, City.class);
            City savedCity = cityService.saveCity(city);
            CityDTO savedCityDTO = modelMapper.map(savedCity, CityDTO.class);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCityDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CityDTO> updateCity(@PathVariable Long id, @RequestBody CityDTO cityDTO) {
        try {
            City city = modelMapper.map(cityDTO, City.class);
            CityDTO updatedCityDTO = cityService.updateCity(id, city);
            return ResponseEntity.ok(updatedCityDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCityById(@PathVariable Long id) {
        String response = cityService.deleteCityById(id);
        return ResponseEntity.ok(response);
    }
}




