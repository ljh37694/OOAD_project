package com.sma.backend.controller;

import com.sma.backend.domain.Subscription;
import com.sma.backend.repository.SubscriptionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.sma.backend.domain.PaymentHistory;
import com.sma.backend.repository.PaymentHistoryRepository;
import java.time.ZonedDateTime;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend access
public class SubscriptionController {

    private final SubscriptionRepository repository;
    private final PaymentHistoryRepository paymentHistoryRepository;

    public SubscriptionController(SubscriptionRepository repository, PaymentHistoryRepository paymentHistoryRepository) {
        this.repository = repository;
        this.paymentHistoryRepository = paymentHistoryRepository;
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
        Subscription saved = repository.save(subscription);
        
        // Mock data seeding
        if (saved.getNextPaymentDate() != null) {
            try {
                LocalDate nextDate = ZonedDateTime.parse(saved.getNextPaymentDate()).toLocalDate();
                int cycleMonths = 1;
                if (saved.getCycle() != null && saved.getCycle().contains("Month")) {
                    String num = saved.getCycle().replaceAll("[^0-9]", "");
                    if (!num.isEmpty()) {
                        cycleMonths = Integer.parseInt(num);
                    }
                }
                
                // Past 3 periods
                for (int i = 1; i <= 3; i++) {
                    PaymentHistory history = PaymentHistory.builder()
                            .userEmail(email)
                            .subscriptionId(saved.getId())
                            .subscriptionName(saved.getName())
                            .price(saved.getSelectedPrice())
                            .icon(saved.getIcon())
                            .color("from-slate-600 to-slate-800")
                            .paymentDate(nextDate.minusMonths((long) cycleMonths * i))
                            .status("PAID")
                            .build();
                    paymentHistoryRepository.save(history);
                }
                
                // Future scheduled payment
                PaymentHistory scheduled = PaymentHistory.builder()
                        .userEmail(email)
                        .subscriptionId(saved.getId())
                        .subscriptionName(saved.getName())
                        .price(saved.getSelectedPrice())
                        .icon(saved.getIcon())
                        .color("from-slate-600 to-slate-800")
                        .paymentDate(nextDate)
                        .status("SCHEDULED")
                        .build();
                paymentHistoryRepository.save(scheduled);
                
            } catch (Exception e) {
                // Ignore parse errors
            }
        }
        
        return saved;
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
