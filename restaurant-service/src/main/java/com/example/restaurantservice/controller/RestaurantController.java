package com.example.restaurantservice.controller;

import com.example.restaurantservice.dto.ApiResponse;
import com.example.restaurantservice.model.MenuItem;
import com.example.restaurantservice.model.Restaurant;
import com.example.restaurantservice.service.RestaurantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/restaurants")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @PostMapping
    public ResponseEntity<ApiResponse<Restaurant>> createRestaurant(@Valid @RequestBody Restaurant restaurant) {
        Restaurant created = restaurantService.createRestaurant(restaurant);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Restaurant created successfully", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Restaurant>>> getAllRestaurants(
            @RequestParam(required = false) String cuisine,
            @RequestParam(required = false) Boolean isOpen) {
        List<Restaurant> restaurants = restaurantService.getAllRestaurants();
        return ResponseEntity.ok(ApiResponse.success(restaurants));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Restaurant>> getRestaurantById(@PathVariable Long id) {
        Restaurant restaurant = restaurantService.getRestaurantById(id);
        return ResponseEntity.ok(ApiResponse.success(restaurant));
    }

    @GetMapping("/{id}/menu")
    public ResponseEntity<ApiResponse<List<MenuItem>>> getRestaurantMenu(@PathVariable Long id) {
        List<MenuItem> menuItems = restaurantService.getMenuItems(id);
        return ResponseEntity.ok(ApiResponse.success(menuItems));
    }

    @PostMapping("/{id}/menu-items")
    public ResponseEntity<ApiResponse<MenuItem>> addMenuItem(
            @PathVariable Long id, 
            @Valid @RequestBody MenuItem menuItem) {
        MenuItem created = restaurantService.addMenuItem(id, menuItem);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Menu item added successfully", created));
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(ApiResponse.success("Restaurant service is running"));
    }
}