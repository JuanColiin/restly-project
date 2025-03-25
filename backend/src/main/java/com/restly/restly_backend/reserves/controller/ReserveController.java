package com.restly.restly_backend.reserves.controller;

import com.restly.restly_backend.reserves.dto.ReserveDTO;
import com.restly.restly_backend.reserves.service.IReserveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/reserves")
public class ReserveController {

    @Autowired
    private IReserveService reserveService;

    @PostMapping
    public ResponseEntity<ReserveDTO> createReserve(@RequestBody ReserveDTO reserveDTO) {
        return ResponseEntity.ok(reserveService.createReserve(reserveDTO));
    }

    @GetMapping
    public ResponseEntity<List<ReserveDTO>> getAllReserves() {
        return ResponseEntity.ok(reserveService.getAllReserves());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReserveDTO>> getReservesByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reserveService.getReservesByProduct(productId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReserveDTO>> getReservesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reserveService.getReservesByUser(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelReserve(@PathVariable Long id) {
        reserveService.cancelReserve(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/product/{productId}/dates")
    public ResponseEntity<?> getReserveDates(
            @PathVariable Long productId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {

            LocalDate start = LocalDate.parse(startDate.trim());
            LocalDate end = LocalDate.parse(endDate.trim());

            List<LocalDate> bookedDates = reserveService.getBookedDates(productId, start, end);
            List<LocalDate> availableDates = reserveService.getAvailableDates(productId, start, end);

            return ResponseEntity.ok(new ReserveDatesResponse(availableDates, bookedDates));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("No se pudo obtener la información en este momento. Intente más tarde.");
        }
    }

    private record ReserveDatesResponse(List<LocalDate> availableDates, List<LocalDate> bookedDates) {}
}
