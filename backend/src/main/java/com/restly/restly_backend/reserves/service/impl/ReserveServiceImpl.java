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

@Service
@RequiredArgsConstructor
public class ReserveServiceImpl implements IReserveService {


    private final IReserveRepository reserveRepository;


    private final IProductRepository productRepository;


    private  final IUserRepository userRepository;


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
}