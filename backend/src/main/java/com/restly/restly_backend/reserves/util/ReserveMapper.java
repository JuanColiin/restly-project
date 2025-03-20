package com.restly.restly_backend.reserves.util;

import com.restly.restly_backend.reserves.dto.ReserveDTO;
import com.restly.restly_backend.reserves.entity.Reserve;
import org.springframework.stereotype.Component;

@Component
public class ReserveMapper {

    public ReserveDTO toDTO(Reserve reserve) {
        return new ReserveDTO(
                reserve.getId(),
                reserve.getStartTime(),
                reserve.getCheckIn(),
                reserve.getCheckOut(),
                reserve.getProduct().getId(),
                reserve.getUser().getId()
        );
    }

    public Reserve toEntity(ReserveDTO reserveDTO) {
        Reserve reserve = new Reserve();
        reserve.setStartTime(reserveDTO.getStartTime());
        reserve.setCheckIn(reserveDTO.getCheckIn());
        reserve.setCheckOut(reserveDTO.getCheckOut());
        return reserve;
    }
}
