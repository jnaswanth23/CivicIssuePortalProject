package com.backend.civicissueportal.service;

import com.backend.civicissueportal.model.PasswordResetOtp;
import com.backend.civicissueportal.repository.PasswordResetOtpRepository;
import com.backend.civicissueportal.repository.UserRepository;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class PasswordResetService {

    private final PasswordResetOtpRepository otpRepo;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    public PasswordResetService(PasswordResetOtpRepository otpRepo,
                               UserRepository userRepo,
                               PasswordEncoder passwordEncoder,
                               JavaMailSender mailSender) {
        this.otpRepo = otpRepo;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    private String generateOtp() {
        return String.format("%06d", new SecureRandom().nextInt(1_000_000));
    }
    public void resetPassword(String email, String otp, String newPassword) {

        var user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid request"));

        PasswordResetOtp latest = otpRepo
                .findTopByEmailOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        if (latest.isUsed())
            throw new RuntimeException("OTP already used");

        if (latest.getExpiresAt().isBefore(LocalDateTime.now()))
            throw new RuntimeException("OTP expired");

        if (!passwordEncoder.matches(otp, latest.getOtpHash()))
            throw new RuntimeException("Invalid OTP");

        // ⚠️ Change this line based on your User field name:
        // If your User has setPasswordHash(...) use that
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepo.save(user);

        latest.setUsed(true);
        otpRepo.save(latest);
    }

    public void sendOtp(String email) {
        if (userRepo.findByEmail(email).isEmpty()) return;

        String otp = generateOtp();

        PasswordResetOtp entity = new PasswordResetOtp();
        entity.setEmail(email);
        entity.setOtpHash(passwordEncoder.encode(otp));
        entity.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        otpRepo.save(entity);

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(email);
        msg.setSubject("Civic Issue Portal - Password Reset OTP");
        msg.setText("Your OTP: " + otp + "\nValid for 5 minutes.");
        mailSender.send(msg);
    }
}
