package com.restly.restly_backend.product.repository;


import com.restly.restly_backend.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryId(Long categoryId);

    boolean existsByTitle(String title);

    @Query("SELECT p FROM Product p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT p FROM Product p WHERE p.city.id = :cityId")
    List<Product> findByCity(@Param("cityId") Long cityId);

    @Query("SELECT p FROM Product p WHERE NOT EXISTS ( " +
            "SELECT 1 FROM Reserve r WHERE r.product = p " +
            "AND r.checkIn <= :checkOut AND r.checkOut >= :checkIn)")
    List<Product> findAvailableProducts(@Param("checkIn") LocalDate checkIn, @Param("checkOut") LocalDate checkOut);

    @Query("SELECT DISTINCT p.title FROM Product p WHERE LOWER(p.title) LIKE LOWER(CONCAT(:query, '%'))")
    List<String> findSuggestions(@Param("query") String query);


    @Query("SELECT DISTINCT p.title FROM Product p WHERE LOWER(p.title) LIKE LOWER(CONCAT(:query, '%'))")
    List<String> findProductTitles(@Param("query") String query);

    @Query("SELECT p FROM Product p " +
            "LEFT JOIN p.city c " +
            "LEFT JOIN c.state s " +
            "LEFT JOIN s.country co " +
            "WHERE (LOWER(TRIM(c.name)) LIKE LOWER(CONCAT('%', :location, '%')) " +
            "OR LOWER(TRIM(s.name)) LIKE LOWER(CONCAT('%', :location, '%')) " +
            "OR LOWER(TRIM(co.name)) LIKE LOWER(CONCAT('%', :location, '%'))) " +
            "AND p NOT IN (SELECT r.product FROM Reserve r " +
            "WHERE r.checkIn <= :checkOut AND r.checkOut >= :checkIn)")
    List<Product> findProductsByLocationAndAvailability(
            @Param("location") String location,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut);

    @Query("SELECT p FROM Product p WHERE NOT EXISTS ( " +
            "SELECT 1 FROM Reserve r WHERE r.product = p " +
            "AND r.checkIn <= :checkOut AND r.checkOut >= :checkIn)")
    List<Product> findProductsByAvailability(@Param("checkIn") LocalDate checkIn, @Param("checkOut") LocalDate checkOut);






}
