package com.restly.restly_backend.locations.address.service;

import com.restly.restly_backend.locations.address.entity.Address;

import java.util.List;
import java.util.Optional;

public interface IAddressService {
    List<Address> getAllAddresses();
    Optional<Address> getAddressById(Long id);
    Optional<Address> getAddressByStreetAndNumber(String street, String number);
    Address saveAddress(Address address);
    Address updateAddress(Address address);
    String deleteAddressById(Long id);
}
