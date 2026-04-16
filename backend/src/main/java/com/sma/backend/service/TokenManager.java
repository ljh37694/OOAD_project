package com.sma.backend.service;

import org.springframework.stereotype.Component;

@Component
public class TokenManager {

    private final String jwtSecret = "defaultSecretKeyForJwtWhichShouldBeLongEnough";

    public String generateToken() {
        // Implementation for generating a token
        return "mock_token";
    }

    public boolean validateToken(String token) {
        // Implementation for validating a token
        return true;
    }
}
