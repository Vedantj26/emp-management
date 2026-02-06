package com.example.employee.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VisitorCreateResponse {
    private VisitorSummary visitor;
    private boolean emailSent;
    private String emailError;
}
