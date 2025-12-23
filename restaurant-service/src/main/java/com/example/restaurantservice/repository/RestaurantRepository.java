package com.example.restaurantservice.repository;

import com.example.restaurantservice.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    boolean existsByName(String name);
    List<Restaurant> findByNameContainingIgnoreCase(String name);
    List<Restaurant> findByCuisineContainingIgnoreCase(String cuisine);
    // Search by Name OR Cuisine OR Menu Item Name
    @Query("SELECT DISTINCT r FROM Restaurant r LEFT JOIN r.menuItems m WHERE " +
           "LOWER(r.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.cuisine) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Restaurant> searchRestaurants(@Param("query") String query);
    
    // Fallback method name query (kept for reference, but replaced by above)
    List<Restaurant> findByNameContainingIgnoreCaseOrCuisineContainingIgnoreCase(String name, String cuisine);
    java.util.Optional<Restaurant> findByName(String name);
}