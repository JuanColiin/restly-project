package com.restly.restly_backend.reserves.service;

import com.restly.restly_backend.reserves.dto.ReserveDTO;


import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


public interface IReserveService {
    List<ReserveDTO> getAllReserves();
    Optional<ReserveDTO> getReserveById(Long id);
    List<ReserveDTO> getReservesByProductId(Long productId);
    List<ReserveDTO> getReservesByUserId(Long userId);
    List<ReserveDTO> getReservesByDateRange(LocalDate startDate, LocalDate endDate);
    ReserveDTO saveReserve(ReserveDTO reserveDTO);
    ReserveDTO updateReserve(Long id, ReserveDTO reserveDTO);
    String deleteReserveById(Long id);
}


