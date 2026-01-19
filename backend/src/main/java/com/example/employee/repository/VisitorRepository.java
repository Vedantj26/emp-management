package com.example.employee.repository;

import com.example.employee.model.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VisitorRepository extends JpaRepository<Visitor, Long> {

    boolean existsByEmailAndExhibitionId(String email, Long exhibitionId);

    List<Visitor> findByExhibitionId(Long exhibitionId);
}
