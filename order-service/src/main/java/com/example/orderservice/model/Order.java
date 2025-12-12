package com.example.orderservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id", nullable = false)
    private String customerId; // Username of customer who placed order
    
    @Column(name = "restaurant_id", nullable = false)
    private Long restaurantId;
    
    @Column(name = "delivery_partner_id")
    private String deliveryPartnerId; // Username of assigned delivery partner
    
    @Column(name = "total_price")
    private Double totalPrice;
    
    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, PREPARING, READY, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
    
    @Column(name = "delivery_address", nullable = false)
    private String deliveryAddress;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}