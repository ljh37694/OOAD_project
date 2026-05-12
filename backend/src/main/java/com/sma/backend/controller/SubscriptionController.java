package com.sma.backend.controller;

import com.sma.backend.domain.Subscription;
import com.sma.backend.repository.SubscriptionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend access
public class SubscriptionController {

    private final SubscriptionRepository repository;

    public SubscriptionController(SubscriptionRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Subscription> getAll(org.springframework.security.core.Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        return repository.findByUserEmail(email);
    }

    @PostMapping
    public Subscription create(@RequestBody Subscription subscription, org.springframework.security.core.Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        subscription.setUserEmail(email);
        return repository.save(subscription);
    }

    @PutMapping("/{id}")
    public Subscription update(@PathVariable Long id, @RequestBody Subscription updatedSub, org.springframework.security.core.Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        return repository.findById(id).map(subscription -> {
            if (subscription.getUserEmail() != null && !subscription.getUserEmail().equals(email)) {
                throw new RuntimeException("Unauthorized");
            }
            if (updatedSub.getName() != null) subscription.setName(updatedSub.getName());
            if (updatedSub.getIcon() != null) subscription.setIcon(updatedSub.getIcon());
            if (updatedSub.getCategory() != null) subscription.setCategory(updatedSub.getCategory());
            if (updatedSub.getCategories() != null) subscription.setCategories(updatedSub.getCategories());
            if (updatedSub.getCycle() != null) subscription.setCycle(updatedSub.getCycle());
            if (updatedSub.getStatus() != null) subscription.setStatus(updatedSub.getStatus());
            if (updatedSub.getMemo() != null) subscription.setMemo(updatedSub.getMemo());
            if (updatedSub.getSelectedPrice() != null) subscription.setSelectedPrice(updatedSub.getSelectedPrice());
            if (updatedSub.getNextPaymentDate() != null) subscription.setNextPaymentDate(updatedSub.getNextPaymentDate());
            
            return repository.save(subscription);
        }).orElseThrow(() -> new RuntimeException("Subscription not found"));
    }
}
