package com.backend.civicissueportal.controller;

import com.backend.civicissueportal.dto.*;
import com.backend.civicissueportal.service.AuthService;
import com.backend.civicissueportal.service.PasswordResetService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    public AuthController(AuthService authService,
                          PasswordResetService passwordResetService) {
        this.authService = authService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    // ---------- SEND OTP ----------
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        passwordResetService.sendOtp(request.getEmail());

        return ResponseEntity.ok(
                Map.of("message", "If account exists, OTP sent to email")
        );
    }

    // ---------- RESET PASSWORD ----------
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        passwordResetService.resetPassword(
                request.getEmail(),
                request.getOtp(),
                request.getNewPassword()
        );

        return ResponseEntity.ok(
                Map.of("message", "Password updated successfully")
        );
    }
}
