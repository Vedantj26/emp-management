package com.example.employee.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VisitorSummary {
    private Long id;
    private String name;
    private String email;
}
