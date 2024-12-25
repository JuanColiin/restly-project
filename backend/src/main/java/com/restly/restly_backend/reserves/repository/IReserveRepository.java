package com.restly.restly_backend.reserves.repository;

import com.restly.restly_backend.reserves.entity.Reserve;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IReserveRepository extends JpaRepository<Reserve, Long> {
    // Método para obtener las reservas por producto
    List<Reserve> findByProductId(Long productId);

    // Método para obtener las reservas por usuario
    List<Reserve> findByUserId(Long userId);

    // Método para obtener reservas por fechas (check-in y check-out)
    List<Reserve> findByCheckInBetween(LocalDate startDate, LocalDate endDate);
}
