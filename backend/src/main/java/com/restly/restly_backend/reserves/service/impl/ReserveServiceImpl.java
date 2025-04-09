package com.restly.restly_backend.reserves.service.impl;

import com.restly.restly_backend.product.entity.Product;
import com.restly.restly_backend.product.repository.IProductRepository;
import com.restly.restly_backend.reserves.dto.ReserveDTO;
import com.restly.restly_backend.reserves.entity.Reserve;
import com.restly.restly_backend.reserves.repository.IReserveRepository;
import com.restly.restly_backend.reserves.service.IReserveService;
import com.restly.restly_backend.reserves.util.ReserveMapper;
import com.restly.restly_backend.security.entity.User;
import com.restly.restly_backend.security.repository.IUserRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ReserveServiceImpl implements IReserveService {

    private final IReserveRepository reserveRepository;
    private final IProductRepository productRepository;
    private final IUserRepository userRepository;
    private final ReserveMapper reserveMapper;

    @Override
    public ReserveDTO createReserve(ReserveDTO reserveDTO) {
        Optional<Product> product = productRepository.findById(reserveDTO.getProductId());
        Optional<User> user = userRepository.findById(reserveDTO.getUserId());

        if (product.isEmpty() || user.isEmpty()) {
            throw new RuntimeException("Producto o usuario no encontrado.");
        }

        Reserve reserve = reserveMapper.toEntity(reserveDTO);
        reserve.setProduct(product.get());
        reserve.setUser(user.get());

        reserve = reserveRepository.save(reserve);
        return reserveMapper.toDTO(reserve);
    }

    @Override
    public List<ReserveDTO> getAllReserves() {
        List<Reserve> reserves = reserveRepository.findAll();
        return reserves.stream().map(reserveMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<ReserveDTO> getReservesByProduct(Long productId) {
        List<Reserve> reserves = reserveRepository.findByProductId(productId);
        return reserves.stream().map(reserveMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<ReserveDTO> getReservesByUser(Long userId) {
        List<Reserve> reserves = reserveRepository.findByUserId(userId);
        return reserves.stream().map(reserveMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public void cancelReserve(Long id) {
        if (!reserveRepository.existsById(id)) {
            throw new RuntimeException("Reserva no encontrada.");
        }
        reserveRepository.deleteById(id);
    }

    @Override
    public List<LocalDate> getBookedDates(Long productId, LocalDate startDate, LocalDate endDate) {
        List<Reserve> reserves = reserveRepository.findByProductIdAndCheckInBetween(productId, startDate, endDate);

        System.out.println("Reservas encontradas para el producto " + productId + ": " + reserves.size());

        return reserves.stream()
                .flatMap(reserve -> {
                    System.out.println("Procesando reserva: CheckIn = " + reserve.getCheckIn() + ", CheckOut = " + reserve.getCheckOut());
                    return Stream.iterate(reserve.getCheckIn(), date -> date.plusDays(1))
                            .limit(reserve.getCheckOut().toEpochDay() - reserve.getCheckIn().toEpochDay());
                })
                .collect(Collectors.toList());
    }


    @Override
    public List<LocalDate> getAvailableDates(Long productId, LocalDate startDate, LocalDate endDate) {
        List<LocalDate> bookedDates = getBookedDates(productId, startDate, endDate);
        return Stream.iterate(startDate, date -> date.plusDays(1))
                .limit(endDate.toEpochDay() - startDate.toEpochDay())
                .filter(date -> !bookedDates.contains(date))
                .collect(Collectors.toList());
    }

    @Override
    public boolean hasUserFinishedReservation(String userEmail, Long productId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        return reserveRepository.findByUserAndProduct(user, product).stream()
                .anyMatch(reserve -> reserve.getCheckOut().isBefore(LocalDate.now()));
    }

}
