package com.backend.civicissueportal.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.civicissueportal.model.Issue;

public interface IssueRepository extends JpaRepository<Issue, Long> {

    Issue findByTrackingId(String trackingId);

    List<Issue> findByUserId(Long userId);

}