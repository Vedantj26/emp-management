package com.example.employee.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exhibition_lead_products")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExhibitionLeadProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", nullable = false)
    private ExhibitionLead lead;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
}

