package com.sma.backend.controller;

import com.sma.backend.domain.Subscription;
import com.sma.backend.repository.SubscriptionRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import com.sma.backend.domain.PaymentHistory;
import com.sma.backend.repository.PaymentHistoryRepository;
import java.time.ZonedDateTime;
import java.time.LocalDate;
import org.springframework.jdbc.core.JdbcTemplate;
import jakarta.annotation.PostConstruct;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend access
public class SubscriptionController {

    private final SubscriptionRepository repository;
    private final PaymentHistoryRepository paymentHistoryRepository;
    private final JdbcTemplate jdbcTemplate;

    public SubscriptionController(SubscriptionRepository repository, PaymentHistoryRepository paymentHistoryRepository, JdbcTemplate jdbcTemplate) {
        this.repository = repository;
        this.paymentHistoryRepository = paymentHistoryRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void initCleanup() {
        try {
            jdbcTemplate.execute("DELETE FROM payment_histories WHERE status = 'SCHEDULED'");
        } catch (Exception e) {
            // Ignore if column status is already deleted or table is empty
        }
        try {
            jdbcTemplate.execute("ALTER TABLE payment_histories DROP COLUMN color");
        } catch (Exception e) {
            // Ignore if column already dropped
        }
        try {
            jdbcTemplate.execute("ALTER TABLE payment_histories DROP COLUMN status");
        } catch (Exception e) {
            // Ignore if column already dropped
        }
        try {
            jdbcTemplate.execute("ALTER TABLE subscriptions MODIFY COLUMN icon LONGTEXT");
        } catch (Exception e) {
            // Ignore if error
        }
        try {
            jdbcTemplate.execute("ALTER TABLE payment_histories MODIFY COLUMN icon LONGTEXT");
        } catch (Exception e) {
            // Ignore if error
        }
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
        
        // Seeding past paid history dynamically based on startDate and nextPaymentDate
        if (saved.getStartDate() != null && saved.getNextPaymentDate() != null) {
            try {
                LocalDate start;
                if (saved.getStartDate().contains("T")) {
                    start = ZonedDateTime.parse(saved.getStartDate()).toLocalDate();
                } else {
                    start = LocalDate.parse(saved.getStartDate());
                }
                
                LocalDate nextDate;
                if (saved.getNextPaymentDate().contains("T")) {
                    nextDate = ZonedDateTime.parse(saved.getNextPaymentDate()).toLocalDate();
                } else {
                    nextDate = LocalDate.parse(saved.getNextPaymentDate());
                }
                
                int cycleMonths = 1;
                if (saved.getCycle() != null && saved.getCycle().contains("Month")) {
                    String num = saved.getCycle().replaceAll("[^0-9]", "");
                    if (!num.isEmpty()) {
                        cycleMonths = Integer.parseInt(num);
                    }
                } else if (saved.getCycle() != null && saved.getCycle().contains("개월")) {
                    String num = saved.getCycle().replaceAll("[^0-9]", "");
                    if (!num.isEmpty()) {
                        cycleMonths = Integer.parseInt(num);
                    }
                }
                
                LocalDate current = start;
                while (current.isBefore(nextDate)) {
                    PaymentHistory history = PaymentHistory.builder()
                            .userEmail(email)
                            .subscriptionId(saved.getId())
                            .subscriptionName(saved.getName())
                            .price(saved.getSelectedPrice())
                            .icon(saved.getIcon())
                            .paymentDate(current)
                            .build();
                    paymentHistoryRepository.save(history);
                    
                    current = current.plusMonths(cycleMonths);
                }
                
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

    @DeleteMapping("/batch")
    @Transactional
    public org.springframework.http.ResponseEntity<?> deleteMultiple(@RequestBody List<Long> ids, org.springframework.security.core.Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        List<Subscription> targets = repository.findAllById(ids).stream()
                .filter(s -> s.getUserEmail() != null && s.getUserEmail().equals(email))
                .toList();
        
        if (!targets.isEmpty()) {
            repository.deleteAll(targets);
        }
        
        return org.springframework.http.ResponseEntity.ok().build();
    }
}
