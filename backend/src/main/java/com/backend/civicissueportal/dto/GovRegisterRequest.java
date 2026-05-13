package com.backend.civicissueportal.dto;

public class GovRegisterRequest {
    private String name;
    private String email;
    private String password;

    public GovRegisterRequest() {}

    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }

    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
}
