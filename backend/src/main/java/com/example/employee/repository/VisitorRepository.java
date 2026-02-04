package com.example.employee.repository;

import com.example.employee.dto.DateCountDto;
import com.example.employee.model.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface VisitorRepository extends JpaRepository<Visitor, Long> {

    // ✅ Total visitors
    long count();

    // ✅ TODAY visitors (THIS METHOD WAS MISSING)
    @Query("""
        SELECT COUNT(v)
        FROM Visitor v
        WHERE v.createdAt >= :start
          AND v.createdAt < :end
    """)
    long countTodayVisitors(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    // ✅ Recent visitors
    List<Visitor> findTop5ByOrderByCreatedAtDesc();

    boolean existsByEmailAndExhibitionId(String email, Long exhibitionId);

    List<Visitor> findByExhibitionId(Long exhibitionId);

    // ✅ Visitors per day analytics (STABLE)
    @Query("""
        SELECT new com.example.employee.dto.DateCountDto(
            CAST(v.createdAt AS java.time.LocalDate),
            COUNT(v)
        )
        FROM Visitor v
        GROUP BY CAST(v.createdAt AS java.time.LocalDate)
        ORDER BY CAST(v.createdAt AS java.time.LocalDate)
    """)
    List<DateCountDto> countVisitorsPerDay();
}
