package com.example.employee.repository;

import com.example.employee.model.VisitorProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VisitorProductRepository extends JpaRepository<VisitorProduct, Long> {

    List<VisitorProduct> findByVisitorId(Long visitorId);
    boolean existsByVisitorIdAndProductId(Long visitorId, Long productId);
}
