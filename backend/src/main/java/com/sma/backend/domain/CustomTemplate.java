package com.sma.backend.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "custom_templates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    private String name;
    private String category;
    private Integer price;
    private String color;

    @Column(columnDefinition = "LONGTEXT")
    private String icon;

    private String pageUrl;
}
