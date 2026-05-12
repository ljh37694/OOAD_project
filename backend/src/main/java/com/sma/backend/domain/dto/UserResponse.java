package com.sma.backend.domain.dto;

import com.sma.backend.domain.User;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class UserResponse {
    private final Long id;
    private final String name;
    private final String email;
    private final String picture;
    private final LocalDate birthdate;
    private final LocalDateTime createdAt;

    public UserResponse(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.picture = user.getPicture();
        this.birthdate = user.getBirthdate();
        this.createdAt = user.getCreatedAt();
    }
}
