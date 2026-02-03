package com.example.employee.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponse {

    private long totalVisitors;
    private long todayVisitors;
    private long totalProductInterests;

    private List<RecentVisitorDto> recentVisitors;
    private DashboardAnalytics analytics;
}

