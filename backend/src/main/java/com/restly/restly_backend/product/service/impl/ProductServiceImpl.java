package com.restly.restly_backend.product.service.impl;
import com.restly.restly_backend.category.entity.Category;
import com.restly.restly_backend.category.service.ICategoryService;
import com.restly.restly_backend.feature.entity.Feature;
import com.restly.restly_backend.image.entity.Image;
import com.restly.restly_backend.locations.address.entity.Address;
import com.restly.restly_backend.locations.city.dto.CityDTO;
import com.restly.restly_backend.locations.city.entity.City;

import com.restly.restly_backend.locations.city.service.ICityService;
import com.restly.restly_backend.locations.country.dto.CountryDTO;
import com.restly.restly_backend.locations.country.entity.Country;
import com.restly.restly_backend.locations.country.repository.ICountryRepository;
import com.restly.restly_backend.locations.state.dto.StateDTO;
import com.restly.restly_backend.locations.state.entity.State;

import com.restly.restly_backend.locations.state.repository.IStateRepository;
import com.restly.restly_backend.locations.state.service.IStateService;
import com.restly.restly_backend.policies.entity.Policy;

import com.restly.restly_backend.product.dto.ProductDTO;
import com.restly.restly_backend.product.entity.Product;
import com.restly.restly_backend.product.repository.IProductRepository;
import com.restly.restly_backend.product.service.IProductService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements IProductService {

    private final IProductRepository productRepository;
    private final ICategoryService categoryService;
    private final ICityService cityService;
    private final IStateService stateService;
    private final ModelMapper modelMapper;
    private final IStateRepository stateRepository;
    private final ICountryRepository countryRepository;

    @Override
    public List<ProductDTO> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ProductDTO> getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        return Optional.of(modelMapper.map(product, ProductDTO.class));
    }

    @Override
    public List<ProductDTO> getProductsByCategory(Long categoryId) {
        Category category = categoryService.getCategoryById(categoryId)
                .map(dto -> modelMapper.map(dto, Category.class))
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + categoryId));

        List<Product> products = productRepository.getByCategory(category);
        return products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public ProductDTO saveProduct(ProductDTO productDTO) {
        // Usar directamente la entidad Category
        Category category = categoryService.getCategory(productDTO.getCategory().getName());

        Policy policy = modelMapper.map(productDTO.getPolicy(), Policy.class);

        Set<Feature> features = productDTO.getFeatures().stream()
                .map(featureDTO -> modelMapper.map(featureDTO, Feature.class))
                .collect(Collectors.toSet());

        City city = resolveCity(productDTO.getAddress().getCity());

        Address address = modelMapper.map(productDTO.getAddress(), Address.class);
        address.setCity(city);

        Product product = modelMapper.map(productDTO, Product.class);
        product.setCategory(category);  // Usamos directamente la entidad Category
        product.setPolicy(policy);
        product.setFeatures(features);
        product.setAddress(address);

        if (productDTO.getImages() != null) {
            List<Image> images = productDTO.getImages().stream()
                    .map(imageDTO -> {
                        Image image = modelMapper.map(imageDTO, Image.class);
                        image.setProduct(product);
                        return image;
                    }).collect(Collectors.toList());
            product.setImages(images);
        }

        Product savedProduct = productRepository.save(product);
        return modelMapper.map(savedProduct, ProductDTO.class);
    }

    @Transactional
    @Override
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));

        existingProduct.setTitle(productDTO.getTitle());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setStars(productDTO.getStars());

        // Usar directamente la entidad Category
        Category category = categoryService.getCategory(productDTO.getCategory().getName());
        existingProduct.setCategory(category);

        Policy policy = modelMapper.map(productDTO.getPolicy(), Policy.class);
        existingProduct.setPolicy(policy);

        Set<Feature> features = productDTO.getFeatures().stream()
                .map(featureDTO -> modelMapper.map(featureDTO, Feature.class))
                .collect(Collectors.toSet());
        existingProduct.setFeatures(features);

        City city = resolveCity(productDTO.getAddress().getCity());

        Address address = modelMapper.map(productDTO.getAddress(), Address.class);
        address.setCity(city);
        existingProduct.setAddress(address);

        if (productDTO.getImages() != null) {
            List<Image> images = productDTO.getImages().stream()
                    .map(imageDTO -> {
                        Image image = modelMapper.map(imageDTO, Image.class);
                        image.setProduct(existingProduct);
                        return image;
                    }).collect(Collectors.toList());
            existingProduct.setImages(images);
        }

        Product updatedProduct = productRepository.save(existingProduct);
        return modelMapper.map(updatedProduct, ProductDTO.class);
    }

    @Override
    public void deleteProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        productRepository.delete(product);
    }

    @Override
    public List<ProductDTO> getProductsByCity(Long cityId) {
        City city = cityService.getCityById(cityId)
                .map(dto -> modelMapper.map(dto, City.class))
                .orElseThrow(() -> new RuntimeException("Ciudad no encontrada con ID: " + cityId));

        List<Product> products = productRepository.getByCity(city);
        return products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getProductsByRangeDate(LocalDate checkInDate, LocalDate checkOutDate) {
        List<Product> products = productRepository.getByRangeDate(checkInDate, checkOutDate);
        return products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getProductsByCityAndRangeDate(Long cityId, LocalDate checkInDate, LocalDate checkOutDate) {
        List<Product> products = productRepository.getByCityAndRangeDate(cityId, checkInDate, checkOutDate);
        return products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getRandomProduct() {
        List<Product> products = productRepository.getRandomProduct();
        return products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
    }

    // Método privado para resolver una ciudad o crearla si no existe
    private City resolveCity(CityDTO cityDTO) {

        Optional<StateDTO> stateDTOOptional = stateService.getStateByName(cityDTO.getState().getName());
        State state;

        if (stateDTOOptional.isPresent()) {
            state = modelMapper.map(stateDTOOptional.get(), State.class);
        } else {

            StateDTO newStateDTO = cityDTO.getState();
            state = modelMapper.map(newStateDTO, State.class);
            stateRepository.save(state);
        }


        Optional<Country> countryOptional = countryRepository.findByName(cityDTO.getState().getCountry().getName());
        Country country;
        if (countryOptional.isPresent()) {
            country = countryOptional.get();
        } else {
            CountryDTO countryDTO = cityDTO.getState().getCountry();
            country = modelMapper.map(countryDTO, Country.class);
            countryRepository.save(country);
        }


        state.setCountry(country);

        Optional<City> cityOptional = cityService.getCityByNameAndState(cityDTO.getName(), state);

        if (cityOptional.isEmpty()) {
            City newCity = new City();
            newCity.setName(cityDTO.getName());
            newCity.setState(state);


            City savedCity = cityService.saveCity(newCity);
            return savedCity;
        }


        return cityOptional.get();
    }

}


