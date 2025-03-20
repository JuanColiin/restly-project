package com.restly.restly_backend.reserves.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
public class ReserveDTO {
    private Long id;
    private LocalTime startTime;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private Long productId;
    private Long userId;

}
