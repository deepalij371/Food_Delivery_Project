package com.example.restaurantservice.controller;

import com.example.restaurantservice.dto.ApiResponse;
import com.example.restaurantservice.model.MenuItem;
import com.example.restaurantservice.model.Restaurant;
import com.example.restaurantservice.service.RestaurantService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/restaurants")
@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
public class RestaurantController {

    @Autowired   
    private RestaurantService restaurantService;

    @PostMapping
    public ResponseEntity<ApiResponse<Restaurant>> createRestaurant(
            @Valid @RequestBody Restaurant restaurant,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        
        log.info("Creating restaurant for owner: {}", userId);
        if (userId != null) {
            restaurant.setOwnerId(userId);
        }
        
        Restaurant created = restaurantService.createRestaurant(restaurant);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Restaurant created successfully", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Restaurant>>> getAllRestaurants(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Boolean isOpen) {
        log.info("Fetching all restaurants with query: {}", query);
        List<Restaurant> restaurants;
        if (query != null && !query.trim().isEmpty()) {
            restaurants = restaurantService.searchRestaurants(query);
        } else {
            restaurants = restaurantService.getAllRestaurants();
        }
        return ResponseEntity.ok(ApiResponse.success(restaurants));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Restaurant>> getRestaurantById(@PathVariable Long id) {
        log.info("Fetching restaurant by ID: {}", id);
        Restaurant restaurant = restaurantService.getRestaurantById(id);
        return ResponseEntity.ok(ApiResponse.success(restaurant));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Restaurant>> updateRestaurant(
            @PathVariable Long id,
            @Valid @RequestBody Restaurant restaurant,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        
        log.info("Updating restaurant ID: {} by user: {}", id, userId);
        Restaurant existing = restaurantService.getRestaurantById(id);
        if (!"ADMIN".equals(userRole) && !existing.getOwnerId().equals(userId)) {
            log.warn("Unauthorized attempt to update restaurant: {} by user: {}", id, userId);
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("You can only update your own restaurants"));
        }
        
        restaurant.setId(id);
        restaurant.setOwnerId(existing.getOwnerId());
        Restaurant updated = restaurantService.updateRestaurant(restaurant);
        return ResponseEntity.ok(ApiResponse.success("Restaurant updated successfully", updated));
    }

    @GetMapping("/{id}/menu")
    public ResponseEntity<ApiResponse<List<MenuItem>>> getRestaurantMenu(@PathVariable Long id) {
        log.info("Fetching menu for restaurant ID: {}", id);
        List<MenuItem> menuItems = restaurantService.getMenuItems(id);
        return ResponseEntity.ok(ApiResponse.success(menuItems));
    }

    @PostMapping("/{id}/menu-items")
    public ResponseEntity<ApiResponse<MenuItem>> addMenuItem(
            @PathVariable Long id, 
            @Valid @RequestBody MenuItem menuItem,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        
        log.info("Adding menu item to restaurant: {} by user: {}", id, userId);
        Restaurant existing = restaurantService.getRestaurantById(id);
        if (!"ADMIN".equals(userRole) && !existing.getOwnerId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("You can only add menu items to your own restaurants"));
        }
        
        MenuItem created = restaurantService.addMenuItem(id, menuItem);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Menu item added successfully", created));
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(ApiResponse.success("Restaurant service is running"));
    }
}
