package com.restly.restly_backend.product.repository;

import com.restly.restly_backend.category.entity.Category;
import com.restly.restly_backend.locations.city.entity.City;
import com.restly.restly_backend.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IProductRepository extends JpaRepository<Product, Long> {

    // Buscar productos por categoría
    List<Product> getByCategory(Category category);

    // Buscar productos por ciudad
    List<Product> getByCity(City city);

    // Buscar productos que no estén reservados en un rango de fechas
    @Query(value = "SELECT P FROM Product P WHERE P.id NOT IN " +
            "(SELECT DISTINCT R.product.id FROM Reserve R WHERE " +
            "(R.checkOut >= :startDate AND R.checkIn <= :endDate))")
    List<Product> getByRangeDate(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Buscar productos por ciudad y que no estén reservados en un rango de fechas
    @Query(value = "SELECT P FROM Product P WHERE P.city.id = :cityId AND P.id NOT IN " +
            "(SELECT DISTINCT R.product.id FROM Reserve R WHERE " +
            "(R.checkOut >= :startDate AND R.checkIn <= :endDate))")
    List<Product> getByCityAndRangeDate(@Param("cityId") Integer cityId,
                                        @Param("startDate") LocalDate startDate,
                                        @Param("endDate") LocalDate endDate);

    // Obtener productos aleatorios
    @Query(value = "SELECT P FROM Product P ORDER BY RAND()")
    List<Product> getRandomProduct();
}
