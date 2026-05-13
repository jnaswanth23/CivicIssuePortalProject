package com.backend.civicissueportal.service;

import com.backend.civicissueportal.model.Issue;
import com.backend.civicissueportal.repository.IssueRepository;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class IssueService {

    @Autowired
    private IssueRepository repo;

    public Issue saveIssue(Issue issue) {
        return repo.save(issue);
    }

    public String generateTrackingId() {

        String random = UUID.randomUUID()
                .toString()
                .substring(0,8)
                .toUpperCase();

        return "CIV-" + random;
    }

}