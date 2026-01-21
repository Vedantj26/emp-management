package com.example.employee.repository;

import com.example.employee.model.Exhibition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExhibitionRepository extends JpaRepository<Exhibition, Long> {

    List<Exhibition> findByDeletedFalse();

    List<Exhibition> findByDeletedFalseAndActiveTrue();

}
