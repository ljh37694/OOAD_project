package com.sma.backend.controller;

import com.sma.backend.domain.CustomTemplate;
import com.sma.backend.repository.CustomTemplateRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/templates")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomTemplateController {

    private final CustomTemplateRepository repository;

    public CustomTemplateController(CustomTemplateRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<CustomTemplate> getAll(Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        return repository.findByUserEmail(email);
    }

    @PostMapping
    public CustomTemplate create(@RequestBody CustomTemplate template, Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        template.setUserEmail(email);
        return repository.save(template);
    }

    @PutMapping("/{id}")
    public CustomTemplate update(@PathVariable Long id, @RequestBody CustomTemplate updatedTemplate, Authentication authentication) {
        String email = (String) authentication.getPrincipal();
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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        return repository.findById(id).map(template -> {
            if (template.getUserEmail() != null && !template.getUserEmail().equals(email)) {
                throw new RuntimeException("Unauthorized");
            }
            repository.delete(template);
            return ResponseEntity.ok().build();
        }).orElseThrow(() -> new RuntimeException("Template not found"));
    }
}
