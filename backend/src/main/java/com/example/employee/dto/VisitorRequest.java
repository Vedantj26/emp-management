package com.example.employee.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class VisitorRequest {

    private String name;
    private String email;
    private String phone;
    private String companyName;

    private Long exhibitionId;
    private List<Long> productIds;
}
