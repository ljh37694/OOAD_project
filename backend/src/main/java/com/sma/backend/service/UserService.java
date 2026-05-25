package com.sma.backend.service;

import com.sma.backend.domain.Role;
import com.sma.backend.domain.User;
import com.sma.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public Optional<User> getCurrentUser(String email) {
        return userRepository.findByEmail(email);
    }

    @Transactional
    public User saveOrUpdate(String name, String email, String picture) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return userRepository.save(user.update(name, picture));
        } else {
            User user = User.builder()
                    .name(name)
                    .email(email)
                    .picture(picture)
                    .role(Role.USER) // Assign default role
                    .build();
            return userRepository.save(user);
        }
    }
}
