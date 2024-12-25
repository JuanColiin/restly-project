package com.restly.restly_backend.locations.state.service;

import com.restly.restly_backend.locations.state.entity.State;

import java.util.List;
import java.util.Optional;

public interface IStateService {
    List<State> getAllStates();
    Optional<State> getStateById(Long id);
    Optional<State> getStateByName(String name);
    State saveState(State state);
    State updateState(State state);
    String deleteStateById(Long id);
}
