package com.restly.restly_backend.reserves.service.impl;

import com.restly.restly_backend.reserves.entity.Reserve;
import com.restly.restly_backend.reserves.repository.IReserveRepository;
import com.restly.restly_backend.reserves.service.IReserveService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReserveServiceImpl implements IReserveService {

    private final IReserveRepository reserveRepository;

    @Override
    public List<Reserve> getAllReserves() {
        return reserveRepository.findAll();
    }

    @Override
    public Optional<Reserve> getReserveById(Long id) {
        return reserveRepository.findById(id);
    }

    @Override
    public List<Reserve> getReservesByProductId(Long productId) {
        return reserveRepository.findByProductId(productId);
    }

    @Override
    public List<Reserve> getReservesByUserId(Long userId) {
        return reserveRepository.findByUserId(userId);
    }

    @Override
    public List<Reserve> getReservesByDateRange(LocalDate startDate, LocalDate endDate) {
        return reserveRepository.findByCheckInBetween(startDate, endDate);
    }

    @Override
    @Transactional
    public Reserve saveReserve(Reserve reserve) {
        return reserveRepository.save(reserve);
    }

    @Override
    @Transactional
    public Reserve updateReserve(Long id, Reserve reserve) {
        if (id == null || reserve == null) {
            throw new IllegalArgumentException("ID y reserva no pueden ser nulos");
        }

        Optional<Reserve> existingReserve = reserveRepository.findById(id);
        if (existingReserve.isEmpty()) {
            throw new RuntimeException("Reserva con ID " + id + " no encontrada");
        }

        Reserve updatedReserve = existingReserve.get();
        updatedReserve.setStartTime(reserve.getStartTime());
        updatedReserve.setCheckIn(reserve.getCheckIn());
        updatedReserve.setCheckOut(reserve.getCheckOut());
        updatedReserve.setProduct(reserve.getProduct());
        updatedReserve.setUser(reserve.getUser());

        return reserveRepository.save(updatedReserve);
    }

    @Override
    @Transactional
    public String deleteReserveById(Long id) {
        Optional<Reserve> existingReserve = reserveRepository.findById(id);
        if (existingReserve.isEmpty()) {
            throw new RuntimeException("Reserva con ID " + id + " no encontrada para eliminar");
        }

        reserveRepository.deleteById(id);
        return "Reserva con ID " + id + " eliminada correctamente";
    }
}
