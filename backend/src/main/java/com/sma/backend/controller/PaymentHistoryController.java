package com.sma.backend.controller;

import com.sma.backend.domain.PaymentHistory;
import com.sma.backend.repository.PaymentHistoryRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentHistoryController {

    private final PaymentHistoryRepository repository;

    public PaymentHistoryController(PaymentHistoryRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<PaymentHistory> getAll(Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        return repository.findByUserEmail(email);
    }
}
