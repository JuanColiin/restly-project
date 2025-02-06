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

    List<Product> getByCategory(Category category);

    List<Product> getByCity(City city);


    @Query(value = "SELECT P FROM Product P WHERE P.id NOT IN " +
            "(SELECT DISTINCT R.product.id FROM Reserve R WHERE " +
            "(R.checkOut >= :startDate AND R.checkIn <= :endDate))")
    List<Product> getByRangeDate(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);


    @Query(value = "SELECT P FROM Product P WHERE P.city.id = :cityId AND P.id NOT IN " +
            "(SELECT DISTINCT R.product.id FROM Reserve R WHERE " +
            "(R.checkOut >= :startDate AND R.checkIn <= :endDate))")
    List<Product> getByCityAndRangeDate(@Param("cityId") Long cityId,
                                        @Param("startDate") LocalDate startDate,
                                        @Param("endDate") LocalDate endDate);


    @Query(value = "SELECT P FROM Product P ORDER BY RAND()")
    List<Product> getRandomProduct();


    boolean existsByTitle(String title);
}
