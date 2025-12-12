package com.example.orderservice.controller;

import com.example.orderservice.model.Order;
import com.example.orderservice.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OrderController {

    @Autowired
    private OrderService orderService;

    // Customer: Create order
    @PostMapping
    public ResponseEntity<?> createOrder(
            @RequestBody Order order,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        if (userId != null) {
            order.setCustomerId(userId);
        }
        
        Order created = orderService.createOrder(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Customer: Get own orders
    @GetMapping
    public ResponseEntity<List<Order>> getCustomerOrders(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        List<Order> orders = orderService.getOrdersByCustomerId(userId);
        return ResponseEntity.ok(orders);
    }

    // Customer/Restaurant/Delivery/Admin: Get order by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        
        Order order = orderService.getOrderById(id);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Check access permissions
        boolean hasAccess = "ADMIN".equals(userRole) ||
                           order.getCustomerId().equals(userId) ||
                           ("DELIVERY_PARTNER".equals(userRole) && userId.equals(order.getDeliveryPartnerId()));
        
        if (!hasAccess) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You don't have permission to view this order"));
        }
        
        return ResponseEntity.ok(order);
    }

    // Restaurant Owner: Get orders for restaurant
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Order>> getRestaurantOrders(
            @PathVariable Long restaurantId,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        
        List<Order> orders = orderService.getOrdersByRestaurantId(restaurantId);
        return ResponseEntity.ok(orders);
    }

    // Restaurant Owner: Update order status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        
        String newStatus = statusUpdate.get("status");
        Order updated = orderService.updateOrderStatus(id, newStatus);
        return ResponseEntity.ok(updated);
    }

    // Delivery Partner: Get available orders
    @GetMapping("/available")
    public ResponseEntity<List<Order>> getAvailableOrders() {
        List<Order> orders = orderService.getAvailableOrders();
        return ResponseEntity.ok(orders);
    }

    // Delivery Partner: Accept order
    @PutMapping("/{id}/accept")
    public ResponseEntity<?> acceptOrder(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        Order order = orderService.assignDeliveryPartner(id, userId);
        return ResponseEntity.ok(order);
    }

    // Delivery Partner: Complete delivery
    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeOrder(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        Order order = orderService.completeOrder(id, userId);
        return ResponseEntity.ok(order);
    }

    // Admin: Get all orders
    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "Order service is running"));
    }
}