package com.restly.restly_backend.reserves.service;

import com.restly.restly_backend.reserves.dto.ReserveDTO;


import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


public interface IReserveService {
    ReserveDTO createReserve(ReserveDTO reserveDTO);
    List<ReserveDTO> getAllReserves();
    List<ReserveDTO> getReservesByProduct(Long productId);
    List<ReserveDTO> getReservesByUser(Long userId);
    void cancelReserve(Long id);
}
