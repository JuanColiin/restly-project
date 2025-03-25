package com.restly.restly_backend.reserves.repository;

import com.restly.restly_backend.reserves.entity.Reserve;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IReserveRepository extends JpaRepository<Reserve, Long> {
    List<Reserve> findByProductId(Long productId);
    List<Reserve> findByUserId(Long userId);
    List<Reserve> findByCheckInBetween(LocalDate startDate, LocalDate endDate);
    List<Reserve> findByProductIdAndCheckInBetween(Long productId, LocalDate startDate, LocalDate endDate);
}
