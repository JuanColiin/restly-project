package com.restly.restly_backend.locations.address.repository;

import com.restly.restly_backend.locations.address.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IAddressRepository extends JpaRepository<Address, Long> {

    Optional<Address> findByStreetAndNumber(String street, String number);
}
