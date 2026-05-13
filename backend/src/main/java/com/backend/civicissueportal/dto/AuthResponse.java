package com.backend.civicissueportal.dto;

public class AuthResponse {

    private boolean success;
    private String message;
    private String role;
    private String token;

    public AuthResponse() {}

    public AuthResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public AuthResponse(boolean success, String message, String role) {
        this.success = success;
        this.message = message;
        this.role = role;
    }

    public AuthResponse(boolean success, String message, String role, String token) {
        this.success = success;
        this.message = message;
        this.role = role;
        this.token = token;
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public String getRole() { return role; }
    public String getToken() { return token; }

    public void setSuccess(boolean success) { this.success = success; }
    public void setMessage(String message) { this.message = message; }
    public void setRole(String role) { this.role = role; }
    public void setToken(String token) { this.token = token; }
}
