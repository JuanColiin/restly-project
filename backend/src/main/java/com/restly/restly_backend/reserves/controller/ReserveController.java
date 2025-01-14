package com.restly.restly_backend.reserves.controller;

import com.restly.restly_backend.reserves.dto.ReserveDTO;
import com.restly.restly_backend.reserves.service.IReserveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/reserves")
@RequiredArgsConstructor
public class ReserveController {

    private final IReserveService reserveService;

    @GetMapping
    public ResponseEntity<List<ReserveDTO>> getAllReserves() {
        List<ReserveDTO> reserves = reserveService.getAllReserves();
        return new ResponseEntity<>(reserves, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReserveDTO> getReserveById(@PathVariable Long id) {
        return reserveService.getReserveById(id)
                .map(reserveDTO -> new ResponseEntity<>(reserveDTO, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReserveDTO>> getReservesByProductId(@PathVariable Long productId) {
        List<ReserveDTO> reserves = reserveService.getReservesByProductId(productId);
        return new ResponseEntity<>(reserves, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReserveDTO>> getReservesByUserId(@PathVariable Long userId) {
        List<ReserveDTO> reserves = reserveService.getReservesByUserId(userId);
        return new ResponseEntity<>(reserves, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ReserveDTO> createReserve(@RequestBody ReserveDTO reserveDTO) {
        ReserveDTO savedReserve = reserveService.saveReserve(reserveDTO);
        return new ResponseEntity<>(savedReserve, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReserveDTO> updateReserve(@PathVariable Long id, @RequestBody ReserveDTO reserveDTO) {
        try {
            ReserveDTO updatedReserve = reserveService.updateReserve(id, reserveDTO);
            return new ResponseEntity<>(updatedReserve, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReserve(@PathVariable Long id) {
        try {
            String response = reserveService.deleteReserveById(id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
