package com.sma.backend.service;

import com.sma.backend.domain.PaymentHistory;
import com.sma.backend.domain.Subscription;
import com.sma.backend.repository.PaymentHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentHistoryRepository paymentHistoryRepository;

    public List<PaymentHistory> getAllPayments(String email) {
        return paymentHistoryRepository.findByUserEmail(email);
    }

    @Transactional
    public void generateInitialHistories(Subscription saved, String email) {
        if (saved.getStartDate() != null && saved.getNextPaymentDate() != null) {
            try {
                LocalDate start = parseDate(saved.getStartDate());
                LocalDate nextDate = parseDate(saved.getNextPaymentDate());
                int cycleMonths = extractCycleMonths(saved.getCycle());
                
                LocalDate current = start;
                while (current.isBefore(nextDate)) {
                    savePaymentHistory(saved, email, current);
                    current = current.plusMonths(cycleMonths);
                }
            } catch (Exception e) {
                // Ignore parse errors
            }
        }
    }

    @Transactional
    public void updatePassedPayments(Subscription sub, LocalDate today) {
        if (sub.getNextPaymentDate() == null) return;
        
        try {
            LocalDate nextDate = parseDate(sub.getNextPaymentDate());
            
            if (nextDate.isBefore(today)) {
                int cycleMonths = extractCycleMonths(sub.getCycle());
                LocalDate current = nextDate;
                
                while (current.isBefore(today)) {
                    savePaymentHistory(sub, sub.getUserEmail(), current);
                    current = current.plusMonths(cycleMonths);
                }
                
                // Update nextPaymentDate directly on the entity (Caller should save the subscription)
                ZonedDateTime nextZoned = current.atStartOfDay(java.time.ZoneId.systemDefault());
                sub.setNextPaymentDate(nextZoned.toString());
            }
        } catch (Exception e) {
            // Ignore parse errors
            throw new RuntimeException("Error updating passed payments", e);
        }
    }

    private LocalDate parseDate(String dateStr) {
        if (dateStr.contains("T")) {
            return ZonedDateTime.parse(dateStr).toLocalDate();
        } else {
            return LocalDate.parse(dateStr);
        }
    }

    private int extractCycleMonths(String cycle) {
        int cycleMonths = 1;
        if (cycle != null && (cycle.contains("Month") || cycle.contains("개월"))) {
            String num = cycle.replaceAll("[^0-9]", "");
            if (!num.isEmpty()) {
                cycleMonths = Integer.parseInt(num);
            }
        }
        return cycleMonths;
    }

    private void savePaymentHistory(Subscription sub, String email, LocalDate date) {
        PaymentHistory history = PaymentHistory.builder()
                .userEmail(email)
                .subscriptionId(sub.getId())
                .subscriptionName(sub.getName())
                .price(sub.getSelectedPrice())
                .icon(sub.getIcon())
                .paymentDate(date)
                .build();
        paymentHistoryRepository.save(history);
    }
}
