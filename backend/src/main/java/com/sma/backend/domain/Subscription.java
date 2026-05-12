package com.sma.backend.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "subscriptions")
@Data
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    private String name;
    private String icon;
    private String category;

    @ElementCollection
    private List<String> categories;

    private String cycle;
    private String status;

    @Column(columnDefinition = "TEXT")
    private String memo;

    private Integer selectedPrice;
    private String nextPaymentDate;

}
