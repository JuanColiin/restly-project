package com.restly.restly_backend.security.service;

import com.restly.restly_backend.security.dto.UserDTO;
import com.restly.restly_backend.security.entity.Role;

import java.util.List;
import java.util.Optional;

public interface IUserService {
    List<UserDTO> getAllUsers();
    Optional<UserDTO> getUserById(Long id);
    UserDTO getCurrentUser(String email);
    void updateUserRole(Long userId, Role newRole);
}
