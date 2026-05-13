package com.backend.civicissueportal.service;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    // ✅ MUST be at least 32 characters
    private static final String SECRET =
            "mySuperSecureJwtSecretKeyForCivicIssuePortal123456";

    private static final long EXP_MS = 1000L * 60 * 60 * 24; // 24 hours

    // ✅ Generate token
    public String generateToken(Long userId, String email, String role) {

        Date now = new Date();
        Date exp = new Date(now.getTime() + EXP_MS);

        return Jwts.builder()
                .setSubject(email)
                .claim("userId", userId)
                .claim("role", role)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)), SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ Extract email
    public String extractEmail(String token) {

        return getClaims(token).getSubject();
    }

    // ✅ Extract userId
    public Long extractUserId(String token) {

        return getClaims(token).get("userId", Long.class);
    }

    // ✅ Common method
    private Claims getClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}