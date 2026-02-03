package com.example.employee.repository;

import com.example.employee.dto.NameCountDto;
import com.example.employee.model.Product;
import com.example.employee.model.VisitorProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface VisitorProductRepository extends JpaRepository<VisitorProduct, Long> {

    boolean existsByVisitorIdAndProductId(Long visitorId, Long productId);

    List<VisitorProduct> findByVisitorId(Long visitorId);

    // ✅ TOTAL product interests (THIS FIXES YOUR ERROR)
    @Query("""
        SELECT COUNT(vp)
        FROM VisitorProduct vp
    """)
    long countTotalProductInterests();

    // ✅ Top products analytics
    @Query("""
        SELECT new com.example.employee.dto.NameCountDto(
            p.name,
            COUNT(vp)
        )
        FROM VisitorProduct vp
        JOIN vp.product p
        GROUP BY p.name
        ORDER BY COUNT(vp) DESC
    """)
    List<NameCountDto> findTopProducts();

    // ✅ Products selected by visitor (used for emails)
    @Query("""
        SELECT vp.product
        FROM VisitorProduct vp
        WHERE vp.visitor.id = :visitorId
    """)
    List<Product> findProductsByVisitorId(Long visitorId);
}
