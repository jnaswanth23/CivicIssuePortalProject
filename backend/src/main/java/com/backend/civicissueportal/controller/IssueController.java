package com.backend.civicissueportal.controller;

import com.backend.civicissueportal.model.Issue;
import com.backend.civicissueportal.repository.IssueRepository;
import com.backend.civicissueportal.service.IssueService;
import com.backend.civicissueportal.service.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin("*")
public class IssueController {

    @Autowired
    private IssueRepository repo;

    @Autowired
    private IssueService issueService;

    // ✅ Inject JwtService
    @Autowired
    private JwtService jwtService;

    // Submit Issue
    @PostMapping("/submit")
    public String submitIssue(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String title,
            @RequestParam String category,
            @RequestParam String description,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam MultipartFile image
    ) throws IOException {

        System.out.println("API HIT");

        // ✅ Extract userId using JwtService
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);

        // Upload folder
        String uploadDir = System.getProperty("user.dir") + "/uploads/";

        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // File name
        String originalName = image.getOriginalFilename();
        if (originalName == null || originalName.isEmpty()) {
            throw new RuntimeException("Image file is missing");
        }

        String fileName = UUID.randomUUID() + "_" + originalName;

        // Save file
        File file = new File(uploadDir + fileName);
        image.transferTo(file);

        // Generate tracking ID
        String trackingId = issueService.generateTrackingId();

        // Save issue
        Issue issue = new Issue();
        issue.setTrackingId(trackingId);
        issue.setTitle(title);
        issue.setCategory(category);
        issue.setDescription(description);
        issue.setAddress(address);
        issue.setLatitude(latitude);
        issue.setLongitude(longitude);
        issue.setImageUrl(fileName);
        issue.setStatus("Pending");
        issue.setUserId(userId);

        repo.save(issue);

        return "Issue submitted successfully. Tracking ID: " + trackingId;
    }

    // Track issue
    @GetMapping("/track/{trackingId}")
    public Issue trackIssue(@PathVariable String trackingId) {
        return repo.findByTrackingId(trackingId);
    }

    // My Reports API
    @GetMapping("/my-reports")
    public List<Issue> getMyReports(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization token missing");
        }

        // ✅ Extract userId using JwtService
        String token = authHeader.substring(7);
        Long userId = jwtService.extractUserId(token);

        return repo.findByUserId(userId);
    }
}