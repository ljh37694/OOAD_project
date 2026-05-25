package com.sma.backend.controller;

import com.sma.backend.domain.PaymentHistory;
import com.sma.backend.service.PaymentService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentHistoryController {

    private final PaymentService paymentService;

    public PaymentHistoryController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public List<PaymentHistory> getAll(Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        return paymentService.getAllPayments(email);
    }
}
