package com.restly.restly_backend.locations.address.controller;

import com.restly.restly_backend.locations.address.dto.AddressDTO;
import com.restly.restly_backend.locations.address.entity.Address;
import com.restly.restly_backend.locations.address.service.IAddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final IAddressService addressService;

    @GetMapping
    public ResponseEntity<List<AddressDTO>> getAllAddresses() {
        List<AddressDTO> addresses = addressService.getAllAddresses();
        if (addresses.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(addresses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAddressById(@PathVariable Long id) {
        if (id == null || id <= 0) {
            return ResponseEntity.badRequest()
                    .body("El ID proporcionado no es válido. Debe ser un número positivo.");
        }

        try {
            Optional<AddressDTO> address = addressService.getAddressById(id);
            if (address.isPresent()) {
                return ResponseEntity.ok(address.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No se encontró ninguna dirección con el ID proporcionado: " + id);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Se produjo un error al obtener la dirección. Detalles: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> saveAddress(@RequestBody AddressDTO addressDTO) {
        try {
            AddressDTO savedAddressDTO = addressService.saveAddress(addressDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedAddressDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar la dirección: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAddress(@PathVariable Long id, @RequestBody AddressDTO addressDTO) {
        try {
            // Llamamos al servicio de actualización pasando el ID y el DTO
            AddressDTO updatedAddressDTO = addressService.updateAddress(id, addressDTO);
            if (updatedAddressDTO != null) {
                return ResponseEntity.ok(updatedAddressDTO);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Dirección no encontrada para actualizar.");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar la dirección: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddressById(@PathVariable Long id) {
        try {
            String message = addressService.deleteAddressById(id);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar la dirección: " + e.getMessage());
        }
    }
}
