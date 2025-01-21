package com.restly.restly_backend.locations.city.dto;

import com.restly.restly_backend.locations.state.dto.StateDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CityDTO {

    private String name;

    private StateDTO state;
}
