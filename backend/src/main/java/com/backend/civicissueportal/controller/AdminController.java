package com.backend.civicissueportal.controller;

import com.backend.civicissueportal.model.Issue;
import com.backend.civicissueportal.repository.IssueRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    private IssueRepository repo;

    // Get all issues
    @GetMapping("/issues")
    public List<Issue> getAllIssues() {
        return repo.findAll();
    }

    // Update issue status + remark
    @PutMapping("/status/{id}")
    public Issue updateStatus(@PathVariable Long id,
                              @RequestBody Map<String,String> body) {

        Issue issue = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        String status = body.get("status");
        String remark = body.get("remark");

        issue.setStatus(status);

        // Save remark if provided
        if(remark != null && !remark.trim().isEmpty()){
            issue.setAdminRemark(remark);
        }

        return repo.save(issue);
    }
}