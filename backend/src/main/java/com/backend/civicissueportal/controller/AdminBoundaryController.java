package com.backend.civicissueportal.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AdminBoundaryController {

    @GetMapping(value="/ap-boundary", produces="application/json")
    public String apBoundary() throws Exception {
        var res = new ClassPathResource("ap_boundary.geojson");
        return StreamUtils.copyToString(res.getInputStream(), StandardCharsets.UTF_8);
    }
}