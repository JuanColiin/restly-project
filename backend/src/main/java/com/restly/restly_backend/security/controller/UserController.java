package com.restly.restly_backend.security.controller;

import com.restly.restly_backend.security.dto.UserDTO;
import com.restly.restly_backend.security.entity.Role;
import com.restly.restly_backend.security.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/update-role/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateUserRole(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        Role newRole = Role.valueOf(request.get("role")); // Convertimos String a Enum
        userService.updateUserRole(userId, newRole);
        return ResponseEntity.ok("Rol actualizado a " + newRole);
    }

}

