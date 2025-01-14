package com.restly.restly_backend.locations.address.service;



import com.restly.restly_backend.locations.address.dto.AddressDTO;

import java.util.List;
import java.util.Optional;


public interface IAddressService {
    List<AddressDTO> getAllAddresses();
    Optional<AddressDTO> getAddressById(Long id);
    Optional<AddressDTO> getAddressByStreetAndNumber(String street, String number);
    AddressDTO saveAddress(AddressDTO addressDTO);
    AddressDTO updateAddress(Long id, AddressDTO addressDTO);
    String deleteAddressById(Long id);
}
