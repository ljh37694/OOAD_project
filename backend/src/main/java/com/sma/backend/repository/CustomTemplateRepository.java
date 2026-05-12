package com.sma.backend.repository;

import com.sma.backend.domain.CustomTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomTemplateRepository extends JpaRepository<CustomTemplate, Long> {
    List<CustomTemplate> findByUserEmail(String userEmail);
}
