package com.restly.restly_backend.locations.state.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.restly.restly_backend.locations.city.dto.CityDTO;
import com.restly.restly_backend.locations.country.dto.CountryDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StateDTO {

    private String name;

    private CountryDTO country;

    @JsonIgnore
    private Set<CityDTO> cities = new HashSet<>();
}

