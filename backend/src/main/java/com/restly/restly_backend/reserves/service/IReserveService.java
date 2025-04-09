package com.restly.restly_backend.reserves.service;

import com.restly.restly_backend.reserves.dto.ReserveDTO;

import java.time.LocalDate;
import java.util.List;

public interface IReserveService {
    ReserveDTO createReserve(ReserveDTO reserveDTO);
    List<ReserveDTO> getAllReserves();
    List<ReserveDTO> getReservesByProduct(Long productId);
    List<ReserveDTO> getReservesByUser(Long userId);
    void cancelReserve(Long id);
    List<LocalDate> getBookedDates(Long productId, LocalDate startDate, LocalDate endDate);
    List<LocalDate> getAvailableDates(Long productId, LocalDate startDate, LocalDate endDate);
    boolean hasUserFinishedReservation(String userEmail, Long productId);

}
