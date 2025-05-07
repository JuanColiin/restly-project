package com.restly.restly_backend.reserves.controller;

import com.restly.restly_backend.reserves.dto.ReserveDTO;
import com.restly.restly_backend.reserves.service.EmailService;
import com.restly.restly_backend.reserves.service.IReserveService;
import com.restly.restly_backend.security.config.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/reserves")
@RequiredArgsConstructor
public class ReserveController {

    private final JwtService jwtService;
    private final IReserveService reserveService;


    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
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
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
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

    @GetMapping("/has-finished")
    public ResponseEntity<Boolean> hasFinishedReservation(
            @RequestParam Long productId,
            @RequestHeader("Authorization") String token
    ) {
        try {
            String jwt = token.replace("Bearer ", "");
            String userEmail = jwtService.extractUsername(jwt);
            boolean hasFinished = reserveService.hasUserFinishedReservation(userEmail, productId);
            return ResponseEntity.ok(hasFinished);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PutMapping("/{id}/extend")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    public ResponseEntity<?> extendReserve(
            @PathVariable Long id,
            @RequestParam("newCheckOut") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate newCheckOut,
            @RequestHeader(value = "Authorization", required = false) String token) {

        try {
            // Verificar autenticación si es necesario
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token de autorización requerido");
            }

            ReserveDTO updated = reserveService.extendReserve(id, newCheckOut);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error al procesar la extensión de reserva: " + e.getMessage());
        }
    }
    private record ReserveDatesResponse(List<LocalDate> availableDates, List<LocalDate> bookedDates) {}
}