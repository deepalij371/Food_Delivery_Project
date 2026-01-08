
package com.example.apigateway.config;

import com.example.apigateway.filter.AuthenticationFilter;
import com.example.apigateway.filter.RoleBasedAuthorizationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Autowired
    private AuthenticationFilter authFilter;
    
    @Autowired
    private RoleBasedAuthorizationFilter roleFilter;

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                // ============= PUBLIC ROUTES (No Authentication) =============
                .route("user-register", r -> r.path("/api/users/register")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://user-service"))
                
                .route("user-login", r -> r.path("/api/users/login")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://user-service"))
                
                .route("restaurants-browse", r -> r.path("/api/restaurants")
                        .and().method("GET")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://restaurant-service"))
                
                .route("restaurant-details", r -> r.path("/api/restaurants/{id}")
                        .and().method("GET")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://restaurant-service"))
                
                // ============= CUSTOMER ROUTES =============
                .route("user-profile-get", r -> r.path("/api/users/profile")
                        .and().method("GET")
                        .filters(f -> f.stripPrefix(1)
                                .filter(authFilter.apply(new AuthenticationFilter.Config()))
                                .filter(roleFilter.apply(c -> c.setAllowedRoles("CUSTOMER", "RESTAURANT_OWNER", "ADMIN", "DELIVERY_PARTNER"))))
                        .uri("lb://user-service"))
                
                .route("user-profile-update", r -> r.path("/api/users/profile")
                        .and().method("PUT")
                        .filters(f -> f.stripPrefix(1)
                                .filter(authFilter.apply(new AuthenticationFilter.Config()))
                                .filter(roleFilter.apply(c -> c.setAllowedRoles("CUSTOMER", "RESTAURANT_OWNER", "ADMIN", "DELIVERY_PARTNER"))))
                        .uri("lb://user-service"))
                
                .route("orders-create", r -> r.path("/api/orders")
                        .and().method("POST")
                        .filters(f -> f.stripPrefix(1)
                                .filter(authFilter.apply(new AuthenticationFilter.Config()))
                                .filter(roleFilter.apply(c -> c.setAllowedRoles("CUSTOMER"))))
                        .uri("lb://order-service"))
                
                .route("orders-customer-view", r -> r.path("/api/orders")
                        .and().method("GET")
                        .filters(f -> f.stripPrefix(1)
                                .filter(authFilter.apply(new AuthenticationFilter.Config()))
                                .filter(roleFilter.apply(c -> c.setAllowedRoles("CUSTOMER"))))
                        .uri("lb://order-service"))
                
                .route("order-details", r -> r.path("/api/orders/{id}")
                        .and().method("GET")
                        .filters(f -> f.stripPrefix(1)
                                .filter(authFilter.apply(new AuthenticationFilter.Config()))
                                .filter(roleFilter.apply(c -> c.setAllowedRoles("CUSTOMER", "RESTAURANT_OWNER", "DELIVERY_PARTNER", "ADMIN"))))
                        .uri("lb://order-service"))
                
                // ============= RESTAURANT OWNER ROUTES =============
                .route("restaurant-create", r -> r.path("/api/restaurants")
                        .and().method("POST")
                        .filters(f -> f.stripPrefix(1)
                                .filter(authFilter.apply(new AuthenticationFilter.Config()))
                                .filter(roleFilter.apply(c -> c.setAllowedRoles("RESTAURANT_OWNER", "ADMIN"))))
                        .uri("lb://restaurant-service"))
                
                .route("restaurant-update", r -> r.path("/api/restaurants/{id}")
                        .and().method("PUT")
                        .filters(f -> f.stripPrefix(1)
                                .filter(authFilter.apply(new AuthenticationFilter.Config()))
                                .filter(roleFilter.apply(c -> c.setAllowedRoles("RESTAURANT_OWNER", "ADMIN"))))
                        .uri("lb://restaurant-service"))
                
                .route("restaurant-delete", r -> r.path("/api/restaurants/{id}")
                        .and().method("DELETE")
                        .filters(f -> f.stripPrefix(1)
                                .filter(authFilter.apply(new AuthenticationFilter.Config()))
                                .filter(roleFilter.apply(c -> c.setAllowedRoles("RESTAURANT_OWNER", "ADMIN"))))
                        .uri("lb://restaurant-service"))
                
                .route("restaurant-orders", r -> r.path("/api/restaurants/{id}/orders")
                        .filters(f -> f.stripPrefix(1)
                                .filter(authFilter.apply(new AuthenticationFilter.Config()))
                                .filter(roleFilter.apply(c -> c.setAllowedRoles("RESTAURANT_OWNER", "ADMIN"))))
                        .uri("lb://order-service"))
                
                .route("order-status-update", r -> r.path("/api/orders/{id}/status")
                        .and().method("PUT")
                        .filters(f -> f.stripPrefix(1)
                                .filter(authFilter.apply(new AuthenticationFilter.Config()))
                                .filter(roleFilter.apply(c -> c.setAllowedRoles("RESTAURANT_OWNER", "ADMIN"))))
                        .uri("lb://order-service"))
                
                // ============= DELIVERY PARTNER ROUTES =============
                .route("orders-available", r -> r.path("/api/orders/available")
                        .filters(f -> f.stripPrefix(1)
                                .filter(authFilter.apply(new AuthenticationFilter.Config()))
                                .filter(roleFilter.apply(c -> c.setAllowedRoles("DELIVERY_PARTNER", "ADMIN"))))
                        .uri("lb://order-service"))
                
                .route("order-accept", r -> r.path("/api/orders/{id}/accept")
                        .and().method("PUT")
                        .filters(f -> f.stripPrefix(1)
                                .filter(authFilter.apply(new AuthenticationFilter.Config()))
                                .filter(roleFilter.apply(c -> c.setAllowedRoles("DELIVERY_PARTNER", "ADMIN"))))
                        .uri("lb://order-service"))
                
                .route("order-complete", r -> r.path("/api/orders/{id}/complete")
                        .and().method("PUT")
                        .filters(f -> f.stripPrefix(1)
                                .filter(authFilter.apply(new AuthenticationFilter.Config()))
                                .filter(roleFilter.apply(c -> c.setAllowedRoles("DELIVERY_PARTNER", "ADMIN"))))
                        .uri("lb://order-service"))
                
                // ============= ADMIN ROUTES =============
                .route("users-list", r -> r.path("/api/users")
                        .and().method("GET")
                        .filters(f -> f.stripPrefix(1)
                                .filter(authFilter.apply(new AuthenticationFilter.Config()))
                                .filter(roleFilter.apply(c -> c.setAllowedRoles("ADMIN"))))
                        .uri("lb://user-service"))
                
                .route("user-delete", r -> r.path("/api/users/{id}")
                        .and().method("DELETE")
                        .filters(f -> f.stripPrefix(1)
                                .filter(authFilter.apply(new AuthenticationFilter.Config()))
                                .filter(roleFilter.apply(c -> c.setAllowedRoles("ADMIN"))))
                        .uri("lb://user-service"))
                
                .route("restaurants-manage", r -> r.path("/api/restaurants/all")
                        .filters(f -> f.stripPrefix(1)
                                .filter(authFilter.apply(new AuthenticationFilter.Config()))
                                .filter(roleFilter.apply(c -> c.setAllowedRoles("ADMIN"))))
                        .uri("lb://restaurant-service"))
                
                .route("orders-all", r -> r.path("/api/orders/all")
                        .filters(f -> f.stripPrefix(1)
                                .filter(authFilter.apply(new AuthenticationFilter.Config()))
                                .filter(roleFilter.apply(c -> c.setAllowedRoles("ADMIN"))))
                        .uri("lb://order-service"))
                
                .route("payment-initiate", r -> r.path("/api/payments/initiate")
                        .filters(f -> f.stripPrefix(1)
                                .filter(authFilter.apply(new AuthenticationFilter.Config())))
                        .uri("lb://order-service"))
                
                .route("payment-verify", r -> r.path("/api/payments/verify")
                        .filters(f -> f.stripPrefix(1)
                                .filter(authFilter.apply(new AuthenticationFilter.Config())))
                        .uri("lb://order-service"))
                
                .build();
    }
}
