package com.sma.backend.controller;

import com.sma.backend.domain.CustomTemplate;
import com.sma.backend.service.CustomTemplateService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/templates")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomTemplateController {

    private final CustomTemplateService customTemplateService;

    public CustomTemplateController(CustomTemplateService customTemplateService) {
        this.customTemplateService = customTemplateService;
    }

    @GetMapping
    public List<CustomTemplate> getAll(Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        return customTemplateService.getAllTemplates(email);
    }

    @PostMapping
    public CustomTemplate create(@RequestBody CustomTemplate template, Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        return customTemplateService.createTemplate(template, email);
    }

    @PutMapping("/{id}")
    public CustomTemplate update(@PathVariable Long id, @RequestBody CustomTemplate updatedTemplate, Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        return customTemplateService.updateTemplate(id, updatedTemplate, email);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        customTemplateService.deleteTemplate(id, email);
        return ResponseEntity.ok().build();
    }
}
