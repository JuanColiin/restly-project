package com.restly.restly_backend.locations.state.controller;

import com.restly.restly_backend.locations.state.entity.State;
import com.restly.restly_backend.locations.state.service.IStateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/states")
public class StateController {

    private final IStateService stateService;

    @Autowired
    public StateController(IStateService stateService) {
        this.stateService = stateService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStateById(@PathVariable Long id) {
        try {
            Optional<State> state = stateService.getStateById(id);
            if (state.isPresent()) {
                return ResponseEntity.ok(state.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Estado con ID " + id + " no encontrado.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener el estado con ID " + id + ". Detalles: " + e.getMessage());
        }
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<?> getStateByName(@PathVariable String name) {
        try {
            Optional<State> state = stateService.getStateByName(name);
            if (state.isPresent()) {
                return ResponseEntity.ok(state.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Estado con nombre " + name + " no encontrado.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al obtener el estado con nombre " + name + ". Detalles: " + e.getMessage());
        }
    }


    @PostMapping
    public ResponseEntity<?> createState(@RequestBody State state) {
        try {
            State savedState = stateService.saveState(state);
            return new ResponseEntity<>(savedState, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al crear el estado: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear el estado. Detalles: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateState(@PathVariable Long id, @RequestBody State state) {
        state.setId(id);
        try {
            State updatedState = stateService.updateState(state);
            return new ResponseEntity<>(updatedState, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al actualizar el estado: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Estado con ID " + id + " no encontrado.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar el estado. Detalles: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteState(@PathVariable Long id) {
        try {
            String response = stateService.deleteStateById(id);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Estado con ID " + id + " no encontrado.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar el estado. Detalles: " + e.getMessage());
        }
    }
}
