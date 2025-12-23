package com.example.apigateway.filter;

import com.example.apigateway.config.JwtUtil;
import io.jsonwebtoken.Claims;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String requestPath = exchange.getRequest().getPath().toString();
            String requestMethod = exchange.getRequest().getMethod().toString();
            
            logger.info("========== AUTHENTICATION FILTER ==========");
            logger.info("🔍 Processing request: {} {}", requestMethod, requestPath);
            
            if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                logger.error("🔴 AUTHENTICATION FAILED: Missing Authorization header");
                logger.info("===========================================");
                return onError(exchange, "Missing authorization header", HttpStatus.UNAUTHORIZED);
            }

            String authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
            logger.info("🔑 Authorization header present: {}", authHeader.substring(0, Math.min(20, authHeader.length())) + "...");
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                authHeader = authHeader.substring(7);
                logger.info("✅ Extracted Bearer token (length: {})", authHeader.length());
            }

            try {
                logger.info("🔐 Validating JWT token...");
                jwtUtil.validateToken(authHeader);
                logger.info("✅ Token validation successful");
                
                // Extract claims and add to headers
                Claims claims = jwtUtil.getAllClaimsFromToken(authHeader);
                String userId = claims.getSubject(); 
                String userRole = jwtUtil.getRoleFromToken(authHeader);
                
                logger.info("👤 User details extracted from token:");
                logger.info("   - User ID: {}", userId);
                logger.info("   - User Role: {}", userRole != null ? userRole : "CUSTOMER (default)");
                
                ServerHttpRequest request = exchange.getRequest().mutate()
                        .header("X-User-Id", userId)
                        .header("X-User-Role", userRole != null ? userRole : "CUSTOMER")
                        .build();

                logger.info("✅ Headers added to request: X-User-Id={}, X-User-Role={}", 
                           userId, userRole != null ? userRole : "CUSTOMER");
                logger.info("🔄 Forwarding request to downstream service");
                logger.info("===========================================");
                
                return chain.filter(exchange.mutate().request(request).build());

            } catch (Exception e) {
                logger.error("🔴 AUTHENTICATION FAILED: Invalid access token");
                logger.error("   Error type: {}", e.getClass().getName());
                logger.error("   Error message: {}", e.getMessage());
                logger.info("===========================================");
                return onError(exchange, "Unauthorized access", HttpStatus.UNAUTHORIZED);
            }
        };
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        response.getHeaders().add("Content-Type", "application/json");
        
        String errorJson = String.format("{\"error\":\"%s\",\"status\":%d}", err, httpStatus.value());
        byte[] bytes = errorJson.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        
        return response.writeWith(reactor.core.publisher.Mono.just(
            exchange.getResponse().bufferFactory().wrap(bytes)
        ));
    }

    public static class Config {
    }
}
