package com.example.orderservice.service;

import com.example.orderservice.model.Order;
import com.example.orderservice.repository.OrderRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @CacheEvict(value = "orders_customer", key = "#order.customerId")
    public Order createOrder(Order order) {
        if (order == null) {
            throw new IllegalArgumentException("Order cannot be null");
        }
        
        // Validate required fields
        if (order.getCustomerId() == null || order.getCustomerId().isEmpty()) {
            throw new IllegalArgumentException("Customer ID is required");
        }
        
        if (order.getRestaurantId() == null) {
            throw new IllegalArgumentException("Restaurant ID is required");
        }
        
        // Default to PENDING_PAYMENT if not specified, as this is the start of the flow
        if (order.getStatus() == null || order.getStatus().isEmpty()) {
            order.setStatus("PENDING_PAYMENT");
        }
        
        // Note: createdAt is automatically set by @PrePersist in Order entity
        
        System.out.println("Creating order for customer: " + order.getCustomerId() + 
                         ", restaurant: " + order.getRestaurantId() + 
                         ", total: " + order.getTotalPrice());
        
        return orderRepository.save(order);
    }

    @Cacheable(value = "order", key = "#id")
    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }
    
    @Cacheable(value = "orders_customer", key = "#customerId")
    public List<Order> getOrdersByCustomerId(String customerId) {
        return orderRepository.findByCustomerId(customerId);
    }
    
    public List<Order> getOrdersByRestaurantId(Long restaurantId) {
        return orderRepository.findByRestaurantId(restaurantId);
    }
    
    public List<Order> getAvailableOrders() {
        // Orders that are ready for delivery but not yet assigned
        return orderRepository.findByStatusAndDeliveryPartnerIdIsNull("READY");
    }
    
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    @Caching(evict = {
        @CacheEvict(value = "order", key = "#id"),
        @CacheEvict(value = "orders_customer", allEntries = true)
    })
    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        if (order != null) {
            order.setStatus(status);
            return orderRepository.save(order);
        }
        return null;
    }
    
    @Caching(evict = {
        @CacheEvict(value = "order", key = "#orderId"),
        @CacheEvict(value = "orders_customer", allEntries = true)
    })
    public Order assignDeliveryPartner(Long orderId, String deliveryPartnerId) {
        Order order = getOrderById(orderId);
        if (order != null) {
            order.setDeliveryPartnerId(deliveryPartnerId);
            order.setStatus("OUT_FOR_DELIVERY");
            return orderRepository.save(order);
        }
        return null;
    }
    
    
    @Caching(evict = {
        @CacheEvict(value = "order", key = "#orderId"),
        @CacheEvict(value = "orders_customer", allEntries = true)
    })
    public Order completeOrder(Long orderId, String deliveryPartnerId) {
        Order order = getOrderById(orderId);
        if (order != null && deliveryPartnerId.equals(order.getDeliveryPartnerId())) {
            order.setStatus("DELIVERED");
            order.setActualDeliveryTime(LocalDateTime.now());
            return orderRepository.save(order);
        }
        return null;
    }

    @Caching(evict = {
        @CacheEvict(value = "order", key = "#orderId"),
        @CacheEvict(value = "orders_customer", allEntries = true)
    })
    public Order updatePaymentStatus(Long orderId, String paymentStatus, String razorpayPaymentId, String razorpaySignature) {
        Order order = getOrderById(orderId);
        if (order != null) {
            order.setPaymentStatus(paymentStatus);
            order.setRazorpayPaymentId(razorpayPaymentId);
            order.setRazorpaySignature(razorpaySignature);
            
            // If payment is successful, update order status to CONFIRMED
            if ("PAID".equals(paymentStatus)) {
                order.setStatus("CONFIRMED");
                // Set estimated delivery time (30-40 minutes from now)
                order.setEstimatedDeliveryTime(LocalDateTime.now().plusMinutes(35));
            } else if ("FAILED".equals(paymentStatus)) {
                order.setStatus("CANCELLED");
                order.setCancellationReason("Payment failed");
            }
            
            System.out.println("Updated payment status for order " + orderId + " to " + paymentStatus);
            return orderRepository.save(order);
        }
        return null;
    }

    @Caching(evict = {
        @CacheEvict(value = "order", key = "#orderId"),
        @CacheEvict(value = "orders_customer", allEntries = true)
    })
    public Order cancelOrder(Long orderId, String reason) {
        Order order = getOrderById(orderId);
        if (order != null) {
            // Only allow cancellation if order is not yet delivered or out for delivery
            if (!"DELIVERED".equals(order.getStatus()) && !"OUT_FOR_DELIVERY".equals(order.getStatus())) {
                order.setStatus("CANCELLED");
                order.setCancellationReason(reason);
                System.out.println("Order " + orderId + " cancelled. Reason: " + reason);
                return orderRepository.save(order);
            } else {
                throw new IllegalStateException("Cannot cancel order in " + order.getStatus() + " status");
            }
        }
        throw new IllegalArgumentException("Order not found with id: " + orderId);
    }

    public boolean isValidStatusTransition(String currentStatus, String newStatus) {
        // Define valid status transitions
        if (currentStatus.equals(newStatus)) return true;
        
        switch (currentStatus) {
            case "PENDING_PAYMENT":
                return "CONFIRMED".equals(newStatus) || "CANCELLED".equals(newStatus);
            case "CONFIRMED":
                return "PREPARING".equals(newStatus) || "CANCELLED".equals(newStatus);
            case "PREPARING":
                return "READY".equals(newStatus) || "CANCELLED".equals(newStatus);
            case "READY":
                return "OUT_FOR_DELIVERY".equals(newStatus);
            case "OUT_FOR_DELIVERY":
                return "DELIVERED".equals(newStatus);
            default:
                return false;
        }
    }
}