package com.example.apigateway.config;

import com.example.apigateway.filter.AuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Autowired
    private AuthenticationFilter filter;

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                // Public routes (Login/Register) - No Authentication Filter
                .route("auth-routes", r -> r.path("/api/users/register", "/api/users/login")
                        .uri("lb://user-service"))
                
                // Protected User Routes
                .route("user-service", r -> r.path("/api/users/**")
                        .filters(f -> f.filter(filter.apply(new AuthenticationFilter.Config())))
                        .uri("lb://user-service"))
                
                // Protected Restaurant Routes
                .route("restaurant-service", r -> r.path("/api/restaurants/**")
                        .filters(f -> f.filter(filter.apply(new AuthenticationFilter.Config())))
                        .uri("lb://restaurant-service"))
                
                // Protected Order Routes
                .route("order-service", r -> r.path("/api/orders/**")
                        .filters(f -> f.filter(filter.apply(new AuthenticationFilter.Config())))
                        .uri("lb://order-service"))
                .build();
    }
}
