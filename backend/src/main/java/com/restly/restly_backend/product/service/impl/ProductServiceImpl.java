package com.restly.restly_backend.product.service.impl;

import com.restly.restly_backend.category.entity.Category;
import com.restly.restly_backend.category.repository.ICategoryRepository;
import com.restly.restly_backend.category.service.ICategoryService;
import com.restly.restly_backend.feature.entity.Feature;
import com.restly.restly_backend.feature.repository.IFeatureRepository;
import com.restly.restly_backend.image.dto.ImageDTO;
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
import com.restly.restly_backend.product.exception.NoProductsInCategoryException;
import com.restly.restly_backend.product.exception.ProductAlreadyExistsException;
import com.restly.restly_backend.product.exception.ProductNotFoundException;
import com.restly.restly_backend.product.repository.IProductRepository;
import com.restly.restly_backend.product.service.IProductService;
import com.restly.restly_backend.review.repository.IReviewRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements IProductService {

    private final IProductRepository productRepository;
    private final ICategoryService categoryService;
    private final ModelMapper modelMapper;
    private final IStateRepository stateRepository;
    private final ICountryRepository countryRepository;
    private final ICityRepository cityRepository;
    private final IFeatureRepository featureRepository;
    private final ICategoryRepository categoryRepository;

    @Override
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(product -> {
                    return modelMapper.map(product, ProductDTO.class);
                })
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ProductDTO> getProductById(Long id) {
        return productRepository.findById(id)
                .map(product -> modelMapper.map(product, ProductDTO.class));
    }

    @Override
    public List<ProductDTO> getProductsByCategory(Long categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new RuntimeException("Categoría no encontrada con ID: " + categoryId);
        }

        List<Product> products = productRepository.findByCategoryId(categoryId);

        if (products.isEmpty()) {
            throw new NoProductsInCategoryException("No hay propiedades en esta categoría.");
        }

        return products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
    }


    @Transactional
    @Override
    public ProductDTO saveProduct(ProductDTO productDTO) {
        if (productRepository.existsByTitle(productDTO.getTitle())) {
            throw new ProductAlreadyExistsException("El nombre del producto ya está en uso.");
        }

        Category category = categoryService.getCategory(productDTO.getCategory().getName());
        Policy policy = modelMapper.map(productDTO.getPolicy(), Policy.class);

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


        product.setCity(city);

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

        if (!existingProduct.getTitle().equals(productDTO.getTitle()) && productRepository.existsByTitle(productDTO.getTitle())) {
            throw new RuntimeException("El nombre del producto ya está en uso.");
        }

        existingProduct.setTitle(productDTO.getTitle());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setShortDescription(productDTO.getShortDescription());

        Category category = categoryService.getCategory(productDTO.getCategory().getName());
        existingProduct.setCategory(category);

        Policy policy = modelMapper.map(productDTO.getPolicy(), Policy.class);
        existingProduct.setPolicy(policy);

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

        // ✅ Eliminar completamente imágenes antiguas y romper relación
        List<Image> oldImages = new ArrayList<>(existingProduct.getImages());
        for (Image image : oldImages) {
            image.setProduct(null); // rompe la relación bidireccional
        }
        existingProduct.getImages().clear(); // elimina de la colección

        // ✅ Agregar nuevas imágenes correctamente vinculadas
        if (productDTO.getImages() != null) {
            for (ImageDTO imageDTO : productDTO.getImages()) {
                Image image = modelMapper.map(imageDTO, Image.class);
                image.setProduct(existingProduct); // relación obligatoria
                existingProduct.getImages().add(image); // agregar a la colección
            }
        }

        return modelMapper.map(productRepository.save(existingProduct), ProductDTO.class);
    }




    @Transactional
    @Override
    public void deleteProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Producto no encontrado con ID: " + id));

        if (!product.getReserves().isEmpty()) {
            throw new RuntimeException("No se puede eliminar el producto porque tiene reservas asociadas.");
        }

        product.setCity(null);

        product.getFeatures().clear();
        product.getImages().clear();

        productRepository.delete(product);
    }


    @Override
    public List<ProductDTO> searchProductsByKeyword(String keyword) {
        List<Product> products = productRepository.searchByKeyword(keyword);
        return products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getProductsByCity(Long cityId) {
        List<Product> products = productRepository.findByCity(cityId);
        return products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getProductsByLocationAndAvailability(String location, LocalDate checkIn, LocalDate checkOut) {
        List<Product> products = productRepository.findProductsByLocationAndAvailability(location.trim(), checkIn, checkOut);

        return products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getProductsByAvailability(LocalDate checkIn, LocalDate checkOut) {
        List<Product> products = productRepository.findProductsByAvailability(checkIn, checkOut);
        return products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getProductsByCityName(String cityName) {
        List<Product> products = productRepository.findProductsByCityName(cityName.trim());
        return products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
    }



    @Override
    public List<ProductDTO> getAvailableProducts(LocalDate checkIn, LocalDate checkOut) {
        List<Product> availableProducts = productRepository.findAvailableProducts(checkIn, checkOut);
        return availableProducts.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<String> getSuggestions(String query) {
        if (query == null || query.trim().length() < 2) {
            return Collections.emptyList();
        }

        //List<String> productSuggestions = productRepository.findProductTitles(query.trim());
        List<String> citySuggestions = cityRepository.findCityNames(query.trim());
        List<String> stateSuggestions = stateRepository.findStateNames(query.trim());
        List<String> countrySuggestions = countryRepository.findCountryNames(query.trim());

        return Stream.of(citySuggestions, stateSuggestions, countrySuggestions)
                .flatMap(Collection::stream)
                .distinct()
                .limit(5)
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

