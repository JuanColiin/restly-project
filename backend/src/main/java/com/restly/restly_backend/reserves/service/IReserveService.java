package com.restly.restly_backend.reserves.service;

import com.restly.restly_backend.reserves.entity.Reserve;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IReserveService {
    List<Reserve> getAllReserves();

    Optional<Reserve> getReserveById(Long id);

    List<Reserve> getReservesByProductId(Long productId);

    List<Reserve> getReservesByUserId(Long userId);

    List<Reserve> getReservesByDateRange(LocalDate startDate, LocalDate endDate);

    Reserve saveReserve(Reserve reserve);

    Reserve updateReserve(Long id, Reserve reserve);

    String deleteReserveById(Long id);
}

