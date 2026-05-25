package com.sma.backend.controller;

import com.sma.backend.domain.Subscription;
import com.sma.backend.service.SubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend access
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping
    public List<Subscription> getAll(Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        return subscriptionService.getAllSubscriptions(email);
    }

    @PostMapping
    public Subscription create(@RequestBody Subscription subscription, Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        return subscriptionService.createSubscription(subscription, email);
    }

    @PutMapping("/{id}")
    public Subscription update(@PathVariable Long id, @RequestBody Subscription updatedSub, Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        return subscriptionService.updateSubscription(id, updatedSub, email);
    }

    @DeleteMapping("/batch")
    public ResponseEntity<?> deleteMultiple(@RequestBody List<Long> ids, Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        subscriptionService.deleteSubscriptions(ids, email);
        return ResponseEntity.ok().build();
    }
}
