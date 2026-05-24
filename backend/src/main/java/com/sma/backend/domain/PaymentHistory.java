package com.sma.backend.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "payment_histories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    private Long subscriptionId;
    private String subscriptionName;
    private Integer price;
    @Column(columnDefinition = "LONGTEXT")
    private String icon;

    private LocalDate paymentDate;
}
