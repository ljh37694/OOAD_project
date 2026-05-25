package com.sma.backend.service;

import com.sma.backend.domain.PaymentHistory;
import com.sma.backend.domain.Subscription;
import com.sma.backend.repository.PaymentHistoryRepository;
import com.sma.backend.repository.SubscriptionRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;

@Service
public class SubscriptionService {

    private final SubscriptionRepository repository;
    private final PaymentService paymentService;
    private final JdbcTemplate jdbcTemplate;

    public SubscriptionService(SubscriptionRepository repository, PaymentService paymentService, JdbcTemplate jdbcTemplate) {
        this.repository = repository;
        this.paymentService = paymentService;
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

    public List<Subscription> getAllSubscriptions(String email) {
        return repository.findByUserEmail(email);
    }

    @Transactional
    public Subscription createSubscription(Subscription subscription, String email) {
        subscription.setUserEmail(email);
        Subscription saved = repository.save(subscription);
        
        // Seeding past paid history dynamically based on startDate and nextPaymentDate
        paymentService.generateInitialHistories(saved, email);
        
        return saved;
    }

    @Transactional
    public Subscription updateSubscription(Long id, Subscription updatedSub, String email) {
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

    @Transactional
    public void deleteSubscriptions(List<Long> ids, String email) {
        List<Subscription> targets = repository.findAllById(ids).stream()
                .filter(s -> s.getUserEmail() != null && s.getUserEmail().equals(email))
                .toList();
        
        if (!targets.isEmpty()) {
            repository.deleteAll(targets);
        }
    }
}
