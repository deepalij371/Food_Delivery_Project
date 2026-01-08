package com.example.userservice.service;

import com.example.userservice.dto.RegisterRequest;
import com.example.userservice.exception.ResourceNotFoundException;
import com.example.userservice.model.User;
import com.example.userservice.repository.UserRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @CacheEvict(value = "users", key = "#registerRequest.email")
    public User register(RegisterRequest registerRequest) {
        User user = new User();
        // Use email as username for consistency
        user.setUsername(registerRequest.getEmail());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        
        user.setFullName(registerRequest.getName());
        user.setPhone(registerRequest.getPhone());
        user.setAddress(registerRequest.getAddress());
        
        if (registerRequest.getRole() == null || registerRequest.getRole().isEmpty()) {
            user.setRole("CUSTOMER");
        } else {
            user.setRole(registerRequest.getRole());
        }
        
        return userRepository.save(user);
    }

    @Cacheable(value = "users", key = "#username")
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }
}