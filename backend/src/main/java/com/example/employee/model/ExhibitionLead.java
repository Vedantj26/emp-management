package com.example.employee.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "exhibition_leads")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExhibitionLead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String visitorName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    private String company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exhibition_id", nullable = false)
    private Exhibition exhibition;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

