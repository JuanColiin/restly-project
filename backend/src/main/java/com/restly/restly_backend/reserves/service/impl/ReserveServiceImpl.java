package com.restly.restly_backend.reserves.service.impl;

import com.restly.restly_backend.product.entity.Product;
import com.restly.restly_backend.product.repository.IProductRepository;
import com.restly.restly_backend.reserves.dto.ReserveDTO;
import com.restly.restly_backend.reserves.entity.Reserve;
import com.restly.restly_backend.reserves.repository.IReserveRepository;
import com.restly.restly_backend.reserves.service.EmailService;
import com.restly.restly_backend.reserves.service.IReserveService;
import com.restly.restly_backend.reserves.util.ReserveMapper;
import com.restly.restly_backend.security.entity.User;
import com.restly.restly_backend.security.repository.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
    private final EmailService emailService;
    private final ReserveMapper reserveMapper;

    @Override
    public ReserveDTO createReserve(ReserveDTO reserveDTO) {
        Optional<Product> product = productRepository.findById(reserveDTO.getProductId());
        Optional<User> user = userRepository.findById(reserveDTO.getUserId());

        if (product.isEmpty() || user.isEmpty()) {
            throw new RuntimeException("Producto o usuario no encontrado.");
        }

        List<Reserve> existingReserves = reserveRepository.findByProductId(reserveDTO.getProductId());
        LocalDate newCheckIn = reserveDTO.getCheckIn();
        LocalDate newCheckOut = reserveDTO.getCheckOut();

        boolean overlap = existingReserves.stream().anyMatch(reserve ->
                newCheckIn.isBefore(reserve.getCheckOut()) && newCheckOut.isAfter(reserve.getCheckIn())
        );

        if (overlap) {
            throw new RuntimeException("Las fechas seleccionadas ya están reservadas.");
        }

        Reserve reserve = reserveMapper.toEntity(reserveDTO);
        reserve.setProduct(product.get());
        reserve.setUser(user.get());

        reserve = reserveRepository.save(reserve);

        emailService.sendReservationEmail(
                user.get().getEmail(),
                user.get().getFirstname(),
                product.get().getTitle(),
                newCheckIn.toString(),
                newCheckOut.toString(),
                false // no es extensión
        );

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

        return reserves.stream()
                .flatMap(reserve ->
                        Stream.iterate(reserve.getCheckIn(), date -> date.plusDays(1))
                                .limit(reserve.getCheckOut().toEpochDay() - reserve.getCheckIn().toEpochDay() + 1)
                )
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
    @Override
    public ReserveDTO extendReserve(Long reserveId, LocalDate newCheckOut) {
        Reserve reserve = reserveRepository.findById(reserveId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        if (newCheckOut.isBefore(LocalDate.now())) {
            throw new RuntimeException("La nueva fecha no puede ser anterior al día actual");
        }

        if (!newCheckOut.isAfter(reserve.getCheckOut())) {
            throw new RuntimeException("La nueva fecha debe ser posterior a " + reserve.getCheckOut());
        }

        Long productId = reserve.getProduct().getId();
        LocalDate currentCheckOut = reserve.getCheckOut();

        List<Reserve> conflicts = reserveRepository.findByProductId(productId).stream()
                .filter(r -> !r.getId().equals(reserveId))
                .filter(r ->
                        currentCheckOut.isBefore(r.getCheckOut()) &&
                                newCheckOut.isAfter(r.getCheckIn())
                )
                .toList();

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Existen reservas conflictivas en las fechas seleccionadas");
        }

        reserve.setCheckOut(newCheckOut);
        reserve = reserveRepository.save(reserve);

        emailService.sendReservationEmail(
                reserve.getUser().getEmail(),
                reserve.getUser().getFirstname(),
                reserve.getProduct().getTitle(),
                reserve.getCheckIn().toString(),
                newCheckOut.toString(),
                true
        );

        return reserveMapper.toDTO(reserve);
    }


}
