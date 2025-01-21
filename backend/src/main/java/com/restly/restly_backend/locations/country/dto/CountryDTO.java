package com.restly.restly_backend.locations.country.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.restly.restly_backend.locations.state.dto.StateDTO;
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
public class CountryDTO {

    private String name;

    @JsonIgnore
    private Set<StateDTO> states = new HashSet<>();
}

