package com.example.employee.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardAnalytics {
    private List<DateCountDto> visitorsPerDay;
    private List<NameCountDto> topProducts;
}
