package com.backend.civicissueportal.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.backend.civicissueportal.dto.AuthResponse;
import com.backend.civicissueportal.dto.LoginRequest;
import com.backend.civicissueportal.dto.RegisterRequest;
import com.backend.civicissueportal.model.User;
import com.backend.civicissueportal.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepo, PasswordEncoder encoder, JwtService jwtService) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    private boolean isValidPassword(String password) {
        return password != null && password.matches("^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");
    }

    public AuthResponse register(RegisterRequest req) {

        if (req.getName() == null || req.getName().isBlank()
                || req.getEmail() == null || req.getEmail().isBlank()
                || req.getPassword() == null || req.getPassword().isBlank()) {
            return new AuthResponse(false, "All fields are required");
        }

        if (!isValidPassword(req.getPassword())) {
            return new AuthResponse(false,
                    "Password must be 8 characters long, contain 1 uppercase letter, 1 number and 1 special character");
        }

        if (userRepo.existsByEmail(req.getEmail())) {
            return new AuthResponse(false, "Email already exists");
        }

        User user = new User(
                req.getName(),
                req.getEmail(),
                encoder.encode(req.getPassword())
        );

        // ✅ ALWAYS USER (no dropdown, no govt register)
        user.setRole("USER");

        userRepo.save(user);

        return new AuthResponse(true, "Registered successfully");
    }

    public AuthResponse login(LoginRequest req) {

        if (req.getEmail() == null || req.getEmail().isBlank()
                || req.getPassword() == null || req.getPassword().isBlank()) {
            return new AuthResponse(false, "Email and password required");
        }

        User user = userRepo.findByEmail(req.getEmail()).orElse(null);

        if (user == null) {
            return new AuthResponse(false, "User not found");
        }

        if (!encoder.matches(req.getPassword(), user.getPasswordHash())) {
            return new AuthResponse(false, "Invalid password");
        }

        // ✅ Generate token with userId
        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole());

        return new AuthResponse(true, "Login successful", user.getRole(), token);
    }
}
