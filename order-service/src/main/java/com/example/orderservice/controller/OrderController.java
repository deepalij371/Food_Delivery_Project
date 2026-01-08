package com.example.orderservice.controller;

import com.example.orderservice.dto.ApiResponse;

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
    public ResponseEntity<ApiResponse<Order>> createOrder(
            @RequestBody Order order,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Role", required = false) String userRole,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        System.out.println("========== ORDER CREATION REQUEST ==========");
        System.out.println("📥 Received order creation request");
        System.out.println("🔑 Headers received:");
        System.out.println("   - X-User-Id: " + (userId != null ? userId : "MISSING"));
        System.out.println("   - X-User-Role: " + (userRole != null ? userRole : "MISSING"));
        System.out.println("   - Authorization: " + (authHeader != null ? "Present (length: " + authHeader.length() + ")" : "MISSING"));
        System.out.println("📦 Order details:");
        System.out.println("   - Restaurant ID: " + order.getRestaurantId());
        System.out.println("   - Items count: " + (order.getItems() != null ? order.getItems().size() : 0));
        System.out.println("   - Total price: " + order.getTotalPrice());
        System.out.println("   - Delivery address: " + (order.getDeliveryAddress() != null ? order.getDeliveryAddress().substring(0, Math.min(50, order.getDeliveryAddress().length())) + "..." : "NULL"));
        
        // Validate user authentication
        if (userId == null || userId.isEmpty()) {
            System.out.println("🔴 AUTHENTICATION FAILED: X-User-Id header is missing");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Please login to place an order"));
        }
        
        System.out.println("✅ Authentication validated: User ID = " + userId);
        
        // Validate order data
        if (order.getRestaurantId() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Restaurant ID is required"));
        }
        if (order.getItems() == null || order.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Order must contain at least one item"));
        }
        if (order.getDeliveryAddress() == null || order.getDeliveryAddress().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Delivery address is required"));
        }
        if (order.getTotalPrice() == null || order.getTotalPrice() <= 0) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid order total"));
        }
        
        System.out.println("✅ All validations passed");
        
        // Set customer ID from authenticated user
        order.setCustomerId(userId);
        
        // Create the order
        System.out.println("💾 Creating order in database...");
        Order created = orderService.createOrder(order);
        
        System.out.println("✅ ORDER CREATED SUCCESSFULLY");
        System.out.println("   - Order ID: " + created.getId());
        System.out.println("   - Customer ID: " + userId);
        System.out.println("   - Restaurant ID: " + order.getRestaurantId());
        System.out.println("   - Total: ₹" + order.getTotalPrice());
        System.out.println("   - Status: " + created.getStatus());
        System.out.println("============================================");
        
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Order created successfully", created));
    }

    // Customer: Get own orders
    @GetMapping
    public ResponseEntity<ApiResponse<List<Order>>> getCustomerOrders(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        
        List<Order> orders = orderService.getOrdersByCustomerId(userId);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    // Customer/Restaurant/Delivery/Admin: Get order by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getOrderById(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        
        Order order = orderService.getOrderById(id);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Order not found"));
        }
        
        // Check access permissions
        boolean hasAccess = "ADMIN".equals(userRole) ||
                           order.getCustomerId().equals(userId) ||
                           ("DELIVERY_PARTNER".equals(userRole) && userId.equals(order.getDeliveryPartnerId()));
        
        if (!hasAccess) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("You don't have permission to view this order"));
        }
        
        return ResponseEntity.ok(ApiResponse.success(order));
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

    // Customer/Admin: Cancel order
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long id,
            @RequestBody Map<String, String> cancelRequest,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {
        
        try {
            String reason = cancelRequest.getOrDefault("reason", "Cancelled by user");
            
            // Check if user has permission to cancel
            Order order = orderService.getOrderById(id);
            if (order == null) {
                return ResponseEntity.notFound().build();
            }
            
            boolean canCancel = "ADMIN".equals(userRole) || order.getCustomerId().equals(userId);
            if (!canCancel) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You don't have permission to cancel this order"));
            }
            
            Order cancelled = orderService.cancelOrder(id, reason);
            return ResponseEntity.ok(cancelled);
            
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "Order service is running"));
    }
}