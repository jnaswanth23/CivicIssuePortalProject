package com.backend.civicissueportal.controller;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AdminTestController {

    @GetMapping("/test")
    public Map<String, String> test() {
        return Map.of("message", "Admin API working ✅");
    }
}