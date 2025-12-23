package com.example.apigateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user-service", r -> r.path("/api/users/**")
                        .filters(f -> f.rewritePath("/api/users/(?<segment>.*)", "/users/${segment}"))
                        .uri("lb://USER-SERVICE"))
                .route("restaurant-service", r -> r.path("/api/restaurants/**")
                        .filters(f -> f.rewritePath("/api/restaurants/(?<segment>.*)", "/restaurants/${segment}"))
                        .uri("lb://RESTAURANT-SERVICE"))
                .route("order-service", r -> r.path("/api/orders/**")
                        .filters(f -> f.rewritePath("/api/orders/(?<segment>.*)", "/orders/${segment}"))
                        .uri("lb://ORDER-SERVICE"))
                .route("payment-service", r -> r.path("/payments/**")
                        .uri("lb://ORDER-SERVICE"))
                .build();
    }
}