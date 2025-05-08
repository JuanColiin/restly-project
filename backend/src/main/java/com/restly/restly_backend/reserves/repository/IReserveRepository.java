package com.restly.restly_backend.reserves.repository;

import com.restly.restly_backend.product.entity.Product;
import com.restly.restly_backend.reserves.entity.Reserve;
import com.restly.restly_backend.security.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IReserveRepository extends JpaRepository<Reserve, Long> {
    List<Reserve> findByProductId(Long productId);
    List<Reserve> findByUserId(Long userId);
    List<Reserve> findByCheckInBetween(LocalDate startDate, LocalDate endDate);
    List<Reserve> findByProductIdAndCheckInBetween(Long productId, LocalDate startDate, LocalDate endDate);
    List<Reserve> findByUserAndProduct(User user, Product product);

    @Query("SELECT r FROM Reserve r WHERE " +
            "r.product.id = :productId AND " +
            "r.id != :excludeId AND " +
            "((r.checkIn <= :endDate AND r.checkOut >= :startDate))")
    List<Reserve> findConflictingReservations(
            @Param("productId") Long productId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("excludeId") Long excludeId);

}
