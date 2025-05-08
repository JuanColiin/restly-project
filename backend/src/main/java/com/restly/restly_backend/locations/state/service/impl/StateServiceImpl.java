package com.restly.restly_backend.locations.state.service.impl;

import com.restly.restly_backend.locations.state.dto.StateDTO;
import com.restly.restly_backend.locations.state.entity.State;
import com.restly.restly_backend.locations.state.repository.IStateRepository;
import com.restly.restly_backend.locations.state.service.IStateService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StateServiceImpl implements IStateService {

    private final IStateRepository stateRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<StateDTO> getAllStates() {
        List<State> states = stateRepository.findAll();
        return states.stream()
                .map(state -> modelMapper.map(state, StateDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<StateDTO> getStateByName(String name) {
        Optional<State> state = stateRepository.findByName(name);
        return state.map(value -> modelMapper.map(value, StateDTO.class));
    }

    @Override
    public StateDTO saveState(StateDTO stateDTO) {
        // Convertimos el DTO a la entidad State
        State state = modelMapper.map(stateDTO, State.class);
        State savedState = stateRepository.save(state);
        return modelMapper.map(savedState, StateDTO.class);
    }

    @Override
    public StateDTO updateState(Long id, StateDTO stateDTO) {
        Optional<State> existingState = stateRepository.findById(id);
        if (existingState.isPresent()) {
            State state = existingState.get();
            modelMapper.map(stateDTO, state);  // Mapea solo las propiedades modificadas
            stateRepository.save(state);
            return modelMapper.map(state, StateDTO.class);
        }
        return null;
    }

    @Override
    public String deleteStateById(Long id) {
        Optional<State> existingState = stateRepository.findById(id);
        if (existingState.isPresent()) {
            stateRepository.deleteById(id);
            return "Estado con ID " + id + " eliminado correctamente";
        }
        return "Estado no encontrado con ID " + id;
    }
}
