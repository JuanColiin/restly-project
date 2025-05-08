package com.restly.restly_backend.locations.state.service;

import com.restly.restly_backend.locations.state.dto.StateDTO;
import com.restly.restly_backend.locations.state.entity.State;

import java.util.List;
import java.util.Optional;


public interface IStateService {

    List<StateDTO> getAllStates();
    Optional<StateDTO> getStateByName(String name);
    StateDTO saveState(StateDTO stateDTO);
    StateDTO updateState(Long id, StateDTO stateDTO);
    String deleteStateById(Long id);
}
