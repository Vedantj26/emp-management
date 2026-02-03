package com.example.employee.service;

import com.example.employee.dto.DashboardAnalytics;
import com.example.employee.dto.DashboardResponse;
import com.example.employee.dto.RecentVisitorDto;
import com.example.employee.repository.VisitorProductRepository;
import com.example.employee.repository.VisitorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final VisitorRepository visitorRepo;
    private final VisitorProductRepository vpRepo;

    public DashboardResponse getDashboard() {

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime startOfTomorrow = today.plusDays(1).atStartOfDay();

        long totalVisitors = visitorRepo.count();
        long todayVisitors =
                visitorRepo.countTodayVisitors(startOfDay, startOfTomorrow);

        long totalProductInterests = vpRepo.countTotalProductInterests();

        List<RecentVisitorDto> recentVisitors =
                visitorRepo.findTop5ByOrderByCreatedAtDesc()
                        .stream()
                        .map(v -> new RecentVisitorDto(
                                v.getId(),
                                v.getName(),
                                v.getEmail(),
                                v.getPhone(),
                                v.getCreatedAt()
                        ))
                        .toList();

        DashboardAnalytics analytics = new DashboardAnalytics(
                visitorRepo.countVisitorsPerDay(),
                vpRepo.findTopProducts()
        );

        return new DashboardResponse(
                totalVisitors,
                todayVisitors,
                totalProductInterests,
                recentVisitors,
                analytics
        );
    }
}
