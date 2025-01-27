package com.restly.restly_backend.product.service.impl;

import com.restly.restly_backend.category.entity.Category;
import com.restly.restly_backend.category.service.ICategoryService;
import com.restly.restly_backend.feature.entity.Feature;
import com.restly.restly_backend.feature.repository.IFeatureRepository;
import com.restly.restly_backend.image.entity.Image;
import com.restly.restly_backend.locations.address.entity.Address;
import com.restly.restly_backend.locations.city.dto.CityDTO;
import com.restly.restly_backend.locations.city.entity.City;
import com.restly.restly_backend.locations.city.repository.ICityRepository;
import com.restly.restly_backend.locations.city.service.ICityService;
import com.restly.restly_backend.locations.country.entity.Country;
import com.restly.restly_backend.locations.country.repository.ICountryRepository;
import com.restly.restly_backend.locations.state.entity.State;
import com.restly.restly_backend.locations.state.repository.IStateRepository;
import com.restly.restly_backend.locations.state.service.IStateService;
import com.restly.restly_backend.policies.entity.Policy;
import com.restly.restly_backend.product.dto.ProductDTO;
import com.restly.restly_backend.product.entity.Product;
import com.restly.restly_backend.product.repository.IProductRepository;
import com.restly.restly_backend.product.service.IProductService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final ICityRepository cityRepository;
    private final IFeatureRepository featureRepository;

    @Override
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ProductDTO> getProductById(Long id) {
        return productRepository.findById(id)
                .map(product -> modelMapper.map(product, ProductDTO.class));
    }

    @Override
    public List<ProductDTO> getProductsByCategory(Long categoryId) {
        Category category = categoryService.getCategoryById(categoryId)
                .map(dto -> modelMapper.map(dto, Category.class))
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + categoryId));

        return productRepository.getByCategory(category).stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public ProductDTO saveProduct(ProductDTO productDTO) {
        Category category = categoryService.getCategory(productDTO.getCategory().getName());
        Policy policy = modelMapper.map(productDTO.getPolicy(), Policy.class);

        // Verificar y agregar las features, evitando duplicados
        Set<Feature> features = productDTO.getFeatures().stream()
                .map(featureDTO -> {
                    Optional<Feature> existingFeature = featureRepository.findByTitle(featureDTO.getTitle());
                    return existingFeature.orElseGet(() -> {
                        Feature newFeature = new Feature();
                        newFeature.setTitle(featureDTO.getTitle());
                        return featureRepository.save(newFeature);
                    });
                })
                .collect(Collectors.toSet());

        City city = resolveCity(productDTO.getAddress().getCity());
        Address address = modelMapper.map(productDTO.getAddress(), Address.class);
        address.setCity(city);

        Product product = modelMapper.map(productDTO, Product.class);
        product.setCategory(category);
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

        return modelMapper.map(productRepository.save(product), ProductDTO.class);
    }


    @Transactional
    @Override
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));

        existingProduct.setTitle(productDTO.getTitle());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setStars(productDTO.getStars());

        Category category = categoryService.getCategory(productDTO.getCategory().getName());
        existingProduct.setCategory(category);

        Policy policy = modelMapper.map(productDTO.getPolicy(), Policy.class);
        existingProduct.setPolicy(policy);

        // Verificar y agregar las features, evitando duplicados
        Set<Feature> features = productDTO.getFeatures().stream()
                .map(featureDTO -> {
                    Optional<Feature> existingFeature = featureRepository.findByTitle(featureDTO.getTitle());
                    return existingFeature.orElseGet(() -> {
                        Feature newFeature = new Feature();
                        newFeature.setTitle(featureDTO.getTitle());
                        return featureRepository.save(newFeature);
                    });
                })
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

        return modelMapper.map(productRepository.save(existingProduct), ProductDTO.class);
    }


    @Override
    public void deleteProductById(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado con ID: " + id);
        }
        productRepository.deleteById(id);
    }

    @Override
    public List<ProductDTO> getProductsByCity(Long cityId) {
        City city = cityService.getCityById(cityId)
                .map(dto -> modelMapper.map(dto, City.class))
                .orElseThrow(() -> new RuntimeException("Ciudad no encontrada con ID: " + cityId));

        return productRepository.getByCity(city).stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getProductsByRangeDate(LocalDate checkInDate, LocalDate checkOutDate) {
        return productRepository.getByRangeDate(checkInDate, checkOutDate).stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getProductsByCityAndRangeDate(Long cityId, LocalDate checkInDate, LocalDate checkOutDate) {
        return productRepository.getByCityAndRangeDate(cityId, checkInDate, checkOutDate).stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getRandomProduct() {
        return productRepository.getRandomProduct().stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
    }

    private City resolveCity(CityDTO cityDTO) {

        Country country = countryRepository.findByName(cityDTO.getState().getCountry().getName())
                .orElseGet(() -> {
                    Country newCountry = modelMapper.map(cityDTO.getState().getCountry(), Country.class);
                    return countryRepository.save(newCountry);
                });


        State state = stateRepository.findByNameAndCountry(cityDTO.getState().getName(), country)
                .orElseGet(() -> {
                    State newState = modelMapper.map(cityDTO.getState(), State.class);
                    newState.setCountry(country);
                    return stateRepository.save(newState);
                });

        return cityRepository.findByNameAndState(cityDTO.getName(), state)
                .orElseGet(() -> {
                    City newCity = modelMapper.map(cityDTO, City.class);
                    newCity.setState(state);
                    return cityRepository.save(newCity);
                });
    }
}
