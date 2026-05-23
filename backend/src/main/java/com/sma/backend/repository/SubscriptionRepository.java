package com.sma.backend.repository;

import com.sma.backend.domain.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByUserEmail(String userEmail);
    List<Subscription> findByStatusAndNextPaymentDateStartingWith(String status, String datePrefix);
}
