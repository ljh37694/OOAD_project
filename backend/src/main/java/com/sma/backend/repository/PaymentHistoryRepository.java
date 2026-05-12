package com.sma.backend.repository;

import com.sma.backend.domain.PaymentHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentHistoryRepository extends JpaRepository<PaymentHistory, Long> {
    List<PaymentHistory> findByUserEmail(String userEmail);
    List<PaymentHistory> findByUserEmailAndSubscriptionId(String userEmail, Long subscriptionId);
}
