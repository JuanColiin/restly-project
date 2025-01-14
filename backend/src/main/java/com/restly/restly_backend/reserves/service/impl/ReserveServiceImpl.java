package com.restly.restly_backend.reserves.service.impl;



import com.restly.restly_backend.reserves.dto.ReserveDTO;
import com.restly.restly_backend.reserves.entity.Reserve;
import com.restly.restly_backend.reserves.repository.IReserveRepository;
import com.restly.restly_backend.reserves.service.IReserveService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReserveServiceImpl implements IReserveService {

    private final IReserveRepository reserveRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<ReserveDTO> getAllReserves() {
        List<Reserve> reserves = reserveRepository.findAll();
        return reserves.stream()
                .map(reserve -> modelMapper.map(reserve, ReserveDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ReserveDTO> getReserveById(Long id) {
        return reserveRepository.findById(id)
                .map(reserve -> modelMapper.map(reserve, ReserveDTO.class));
    }

    @Override
    public List<ReserveDTO> getReservesByProductId(Long productId) {
        List<Reserve> reserves = reserveRepository.findByProductId(productId);
        return reserves.stream()
                .map(reserve -> modelMapper.map(reserve, ReserveDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ReserveDTO> getReservesByUserId(Long userId) {
        List<Reserve> reserves = reserveRepository.findByUserId(userId);
        return reserves.stream()
                .map(reserve -> modelMapper.map(reserve, ReserveDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ReserveDTO> getReservesByDateRange(LocalDate startDate, LocalDate endDate) {
        List<Reserve> reserves = reserveRepository.findByCheckInBetween(startDate, endDate);
        return reserves.stream()
                .map(reserve -> modelMapper.map(reserve, ReserveDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ReserveDTO saveReserve(ReserveDTO reserveDTO) {
        Reserve reserve = modelMapper.map(reserveDTO, Reserve.class);
        Reserve savedReserve = reserveRepository.save(reserve);
        return modelMapper.map(savedReserve, ReserveDTO.class);
    }

    @Override
    @Transactional
    public ReserveDTO updateReserve(Long id, ReserveDTO reserveDTO) {
        Optional<Reserve> existingReserve = reserveRepository.findById(id);
        if (existingReserve.isEmpty()) {
            throw new RuntimeException("Reserva no encontrada");
        }

        Reserve reserve = existingReserve.get();
        modelMapper.map(reserveDTO, reserve);  // Actualizar solo los campos del DTO
        Reserve updatedReserve = reserveRepository.save(reserve);
        return modelMapper.map(updatedReserve, ReserveDTO.class);
    }

    @Override
    @Transactional
    public String deleteReserveById(Long id) {
        Optional<Reserve> existingReserve = reserveRepository.findById(id);
        if (existingReserve.isEmpty()) {
            throw new RuntimeException("Reserva no encontrada");
        }

        reserveRepository.deleteById(id);
        return "Reserva eliminada con éxito";
    }
}
