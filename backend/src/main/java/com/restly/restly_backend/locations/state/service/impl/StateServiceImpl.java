package com.restly.restly_backend.locations.state.service.impl;

import com.restly.restly_backend.locations.state.entity.State;
import com.restly.restly_backend.locations.state.repository.IStateRepository;
import com.restly.restly_backend.locations.state.service.IStateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class StateServiceImpl implements IStateService {

    private final IStateRepository stateRepository;

    @Autowired
    public StateServiceImpl(IStateRepository stateRepository) {
        this.stateRepository = stateRepository;
    }

    @Override
    public List<State> getAllStates() {
        return stateRepository.findAll();
    }

    @Override
    public Optional<State> getStateById(Long id) {
        return stateRepository.findById(id);
    }

    @Override
    public Optional<State> getStateByName(String name) {
        return stateRepository.findByName(name);
    }

    @Override
    @Transactional
    public State saveState(State state) {
        if (state == null || state.getName() == null || state.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del estado no puede ser nulo ni vacío");
        }
        return stateRepository.save(state);
    }

    @Override
    @Transactional
    public State updateState(State state) {
        if (state == null || state.getId() == null) {
            throw new IllegalArgumentException("Debe proporcionar un estado y su ID para actualizar");
        }

        Optional<State> existingState = stateRepository.findById(state.getId());
        if (existingState.isEmpty()) {
            throw new RuntimeException("Estado con ID " + state.getId() + " no encontrado para actualizar");
        }

        existingState.get().setName(state.getName());
        existingState.get().setCountry(state.getCountry());

        return stateRepository.save(existingState.get());
    }

    @Override
    @Transactional
    public String deleteStateById(Long id) {
        Optional<State> existingState = stateRepository.findById(id);
        if (existingState.isEmpty()) {
            throw new RuntimeException("Estado con ID " + id + " no encontrado para eliminar");
        }

        stateRepository.deleteById(id);
        return "El estado con ID " + id + " ha sido eliminado correctamente.";
    }
}
