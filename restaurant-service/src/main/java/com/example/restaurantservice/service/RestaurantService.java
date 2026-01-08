package com.example.restaurantservice.service;

import com.example.restaurantservice.exception.ResourceNotFoundException;
import com.example.restaurantservice.model.MenuItem;
import com.example.restaurantservice.model.Restaurant;
import com.example.restaurantservice.repository.MenuItemRepository;
import com.example.restaurantservice.repository.RestaurantRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @CacheEvict(value = "restaurants", allEntries = true)
    public Restaurant createRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    @Cacheable(value = "restaurants")
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    @Cacheable(value = "restaurants", key = "#query", condition = "#query != null")
    public List<Restaurant> searchRestaurants(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllRestaurants();
        }
        return restaurantRepository.searchRestaurants(query);
    }

    @Cacheable(value = "restaurant", key = "#id")
    public Restaurant getRestaurantById(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
    }
    
    @Caching(evict = {
        @CacheEvict(value = "restaurant", key = "#restaurant.id"),
        @CacheEvict(value = "restaurants", allEntries = true)
    })
    public Restaurant updateRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }
    
    @Caching(evict = {
        @CacheEvict(value = "restaurant", key = "#id"),
        @CacheEvict(value = "restaurants", allEntries = true)
    })
    public void deleteRestaurant(Long id) {
        Restaurant restaurant = getRestaurantById(id);
        restaurantRepository.delete(restaurant);
    }

    @Cacheable(value = "menuItems", key = "#restaurantId")
    public List<MenuItem> getMenuItems(Long restaurantId) {
        // Explicitly fetch from repository to ensure fresh data and avoid lazy loading issues
        return menuItemRepository.findByRestaurantId(restaurantId);
    }

    @CacheEvict(value = "menuItems", key = "#restaurantId")
    public MenuItem addMenuItem(Long restaurantId, MenuItem menuItem) {
        Restaurant restaurant = getRestaurantById(restaurantId);
        menuItem.setRestaurant(restaurant);
        return menuItemRepository.save(menuItem);
    }
}