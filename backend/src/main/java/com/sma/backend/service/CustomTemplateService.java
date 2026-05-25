package com.sma.backend.service;

import com.sma.backend.domain.CustomTemplate;
import com.sma.backend.repository.CustomTemplateRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CustomTemplateService {

    private final CustomTemplateRepository repository;

    public CustomTemplateService(CustomTemplateRepository repository) {
        this.repository = repository;
    }

    public List<CustomTemplate> getAllTemplates(String email) {
        return repository.findByUserEmail(email);
    }

    @Transactional
    public CustomTemplate createTemplate(CustomTemplate template, String email) {
        template.setUserEmail(email);
        return repository.save(template);
    }

    @Transactional
    public CustomTemplate updateTemplate(Long id, CustomTemplate updatedTemplate, String email) {
        return repository.findById(id).map(template -> {
            if (template.getUserEmail() != null && !template.getUserEmail().equals(email)) {
                throw new RuntimeException("Unauthorized");
            }
            if (updatedTemplate.getName() != null) template.setName(updatedTemplate.getName());
            if (updatedTemplate.getCategory() != null) template.setCategory(updatedTemplate.getCategory());
            if (updatedTemplate.getPrice() != null) template.setPrice(updatedTemplate.getPrice());
            if (updatedTemplate.getColor() != null) template.setColor(updatedTemplate.getColor());
            if (updatedTemplate.getIcon() != null) template.setIcon(updatedTemplate.getIcon());
            if (updatedTemplate.getPageUrl() != null) template.setPageUrl(updatedTemplate.getPageUrl());
            
            return repository.save(template);
        }).orElseThrow(() -> new RuntimeException("Template not found"));
    }

    @Transactional
    public void deleteTemplate(Long id, String email) {
        repository.findById(id).ifPresent(template -> {
            if (template.getUserEmail() != null && !template.getUserEmail().equals(email)) {
                throw new RuntimeException("Unauthorized");
            }
            repository.delete(template);
        });
    }
}
