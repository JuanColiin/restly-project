package com.restly.restly_backend.security.dto;

import com.restly.restly_backend.security.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String firstname;
    private String lastname;
    private String username;
    private String email;
    private Role role;
}
