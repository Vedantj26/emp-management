package com.example.employee.controller;

import com.example.employee.model.Exhibition;
import com.example.employee.service.ExhibitionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exhibitions")
@RequiredArgsConstructor
@CrossOrigin
public class ExhibitionController {

    private final ExhibitionService exhibitionService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Exhibition create(@RequestBody Exhibition exhibition) {
        return exhibitionService.createExhibition(exhibition);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Exhibition update(
            @PathVariable Long id,
            @RequestBody Exhibition exhibition
    ) {
        return exhibitionService.updateExhibition(id, exhibition);
    }

    @GetMapping
    public List<Exhibition> getAll() {
        return exhibitionService.getAllExhibitions();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        exhibitionService.deleteExhibition(id);
    }
}
