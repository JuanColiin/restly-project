package com.restly.restly_backend.locations.address.service.impl;

import com.restly.restly_backend.locations.address.entity.Address;
import com.restly.restly_backend.locations.address.repository.IAddressRepository;
import com.restly.restly_backend.locations.address.service.IAddressService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements IAddressService {

    private final IAddressRepository addressRepository;

    @Override
    public List<Address> getAllAddresses() {
        return addressRepository.findAll();
    }

    @Override
    public Optional<Address> getAddressById(Long id) {
        return addressRepository.findById(id);
    }

    @Override
    public Optional<Address> getAddressByStreetAndNumber(String street, String number) {
        return addressRepository.findByStreetAndNumber(street, number);
    }

    @Override
    @Transactional
    public Address saveAddress(Address address) {
        if (address == null || address.getStreet() == null || address.getNumber() == null || address.getCity() == null) {
            throw new IllegalArgumentException("La dirección debe tener calle, número y ciudad válidos.");
        }
        return addressRepository.save(address);
    }

    @Override
    @Transactional
    public Address updateAddress(Address address) {
        if (address == null || address.getId() == null) {
            throw new IllegalArgumentException("Debe proporcionar una dirección válida con ID para actualizar.");
        }

        Optional<Address> existingAddress = addressRepository.findById(address.getId());
        if (existingAddress.isEmpty()) {
            throw new RuntimeException("La dirección con ID " + address.getId() + " no existe para actualizar.");
        }

        Address updatedAddress = existingAddress.get();
        updatedAddress.setStreet(address.getStreet());
        updatedAddress.setNumber(address.getNumber());
        updatedAddress.setCity(address.getCity());

        return addressRepository.save(updatedAddress);
    }

    @Override
    @Transactional
    public String deleteAddressById(Long id) {
        Optional<Address> existingAddress = addressRepository.findById(id);
        if (existingAddress.isEmpty()) {
            throw new RuntimeException("La dirección con ID " + id + " no existe para eliminar.");
        }

        addressRepository.deleteById(id);
        return "La dirección con ID " + id + " ha sido eliminada correctamente.";
    }
}
