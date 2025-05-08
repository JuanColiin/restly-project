package com.restly.restly_backend.locations.country.controller;

import com.restly.restly_backend.locations.country.dto.CountryDTO;
import com.restly.restly_backend.locations.country.entity.Country;
import com.restly.restly_backend.locations.country.service.ICountryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/countries")
@RequiredArgsConstructor
public class CountryController {

    private final ICountryService countryService;

    @GetMapping
    public ResponseEntity<List<CountryDTO>> getAllCountries() {
        List<CountryDTO> countries = countryService.getAllCountries();
        if (countries.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(countries);
    }

    @PostMapping
    public ResponseEntity<?> saveCountry(@RequestBody CountryDTO countryDTO) {
        try {
            if (countryDTO.getName() == null || countryDTO.getName().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("El nombre del país es obligatorio.");
            }

            CountryDTO savedCountry = countryService.saveCountry(countryDTO);

            if (savedCountry != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(savedCountry);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar el país.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar el país.");
        }
    }
}

