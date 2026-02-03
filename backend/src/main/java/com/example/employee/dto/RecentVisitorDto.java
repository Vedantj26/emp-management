package com.example.employee.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecentVisitorDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private LocalDateTime createdAt;
}

