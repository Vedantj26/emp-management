package com.example.employee.controller;

import com.example.employee.dto.VisitorCreateResponse;
import com.example.employee.dto.VisitorRequest;
import com.example.employee.model.Visitor;
import com.example.employee.service.VisitorService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visitors")
@RequiredArgsConstructor
@CrossOrigin
public class VisitorController {

    private final VisitorService visitorService;

    @PostMapping
    public VisitorCreateResponse createVisitor(@RequestBody VisitorRequest request) {
        return visitorService.createVisitorPublic(request);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/exhibition/{exhibitionId}")
    public Object getByExhibition(@PathVariable Long exhibitionId) {
        return visitorService.getVisitorsByExhibition(exhibitionId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public Object getAll() {
        return visitorService.getAllVisitors();
    }
}
