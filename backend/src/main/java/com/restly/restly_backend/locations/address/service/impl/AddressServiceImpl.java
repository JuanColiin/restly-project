package com.restly.restly_backend.locations.address.service.impl;

import com.restly.restly_backend.locations.address.dto.AddressDTO;
import com.restly.restly_backend.locations.address.entity.Address;
import com.restly.restly_backend.locations.address.repository.IAddressRepository;
import com.restly.restly_backend.locations.address.service.IAddressService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements IAddressService {

    private final IAddressRepository addressRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<AddressDTO> getAllAddresses() {
        List<Address> addresses = addressRepository.findAll();
        return addresses.stream()
                .map(address -> modelMapper.map(address, AddressDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<AddressDTO> getAddressById(Long id) {
        Optional<Address> address = addressRepository.findById(id);
        return address.map(value -> modelMapper.map(value, AddressDTO.class));
    }

    @Override
    public Optional<AddressDTO> getAddressByStreetAndNumber(String street, String number) {
        Optional<Address> address = addressRepository.findByStreetAndNumber(street, number);
        return address.map(value -> modelMapper.map(value, AddressDTO.class));
    }

    @Override
    public AddressDTO saveAddress(AddressDTO addressDTO) {
        Address address = modelMapper.map(addressDTO, Address.class);
        Address savedAddress = addressRepository.save(address);
        return modelMapper.map(savedAddress, AddressDTO.class);
    }
    @Override
    public AddressDTO updateAddress(Long id, AddressDTO addressDTO) {
        Optional<Address> existingAddress = addressRepository.findById(id);
        if (existingAddress.isPresent()) {
            Address address = existingAddress.get();
            // Mapear los datos del DTO a la entidad
            modelMapper.map(addressDTO, address);  // Actualizamos solo las propiedades que vienen del DTO
            addressRepository.save(address);  // Guardar la entidad actualizada
            return modelMapper.map(address, AddressDTO.class);  // Retornamos el DTO actualizado
        }
        return null;  // Si no encontramos la dirección con el id, retornamos null
    }


    @Override
    public String deleteAddressById(Long id) {
        Optional<Address> existingAddress = addressRepository.findById(id);
        if (existingAddress.isPresent()) {
            addressRepository.deleteById(id);
            return "La dirección con ID " + id + " eliminada correctamente";
        }
        return "Dirección no encontrada con ID " + id;
    }
}
