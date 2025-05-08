package com.restly.restly_backend.locations.state.controller;

import com.restly.restly_backend.locations.state.dto.StateDTO;
import com.restly.restly_backend.locations.state.service.IStateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/states")
@RequiredArgsConstructor
public class StateController {

    private final IStateService stateService;

    @GetMapping
    public ResponseEntity<List<StateDTO>> getAllStates() {
        List<StateDTO> states = stateService.getAllStates();
        if (states.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(states);
    }

    @GetMapping("/{name}")
    public ResponseEntity<?> getStateByName(@PathVariable String name) {
        Optional<StateDTO> stateDTO = stateService.getStateByName(name);
        if (stateDTO.isPresent()) {
            return ResponseEntity.ok(stateDTO.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Estado con nombre " + name + " no encontrado.");
        }
    }

    @PostMapping
    public ResponseEntity<?> saveState(@RequestBody StateDTO stateDTO) {
        StateDTO savedStateDTO = stateService.saveState(stateDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedStateDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateState(@PathVariable Long id, @RequestBody StateDTO stateDTO) {
        StateDTO updatedStateDTO = stateService.updateState(id, stateDTO);
        if (updatedStateDTO != null) {
            return ResponseEntity.ok(updatedStateDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Estado con ID " + id + " no encontrado para actualizar.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteState(@PathVariable Long id) {
        String response = stateService.deleteStateById(id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
