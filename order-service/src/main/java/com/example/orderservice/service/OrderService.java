package com.example.orderservice.service;

import com.example.orderservice.model.Order;
import com.example.orderservice.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Order createOrder(Order order) {
        // Validate order object
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
        
        // Set creation timestamp if not set
        if (order.getCreatedAt() == null) {
            order.setCreatedAt(new java.util.Date());
        }
        
        System.out.println("Creating order for customer: " + order.getCustomerId() + 
                         ", restaurant: " + order.getRestaurantId() + 
                         ", total: " + order.getTotalPrice());
        
        return orderRepository.save(order);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }
    
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
    
    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        if (order != null) {
            order.setStatus(status);
            return orderRepository.save(order);
        }
        return null;
    }
    
    public Order assignDeliveryPartner(Long orderId, String deliveryPartnerId) {
        Order order = getOrderById(orderId);
        if (order != null) {
            order.setDeliveryPartnerId(deliveryPartnerId);
            order.setStatus("OUT_FOR_DELIVERY");
            return orderRepository.save(order);
        }
        return null;
    }
    
    public Order completeOrder(Long orderId, String deliveryPartnerId) {
        Order order = getOrderById(orderId);
        if (order != null && deliveryPartnerId.equals(order.getDeliveryPartnerId())) {
            order.setStatus("DELIVERED");
            return orderRepository.save(order);
        }
        return null;
    }
}