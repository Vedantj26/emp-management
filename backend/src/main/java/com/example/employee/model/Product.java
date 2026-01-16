package com.example.employee.model;

import com.example.employee.security.EncryptedStringConverter;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 1000)
    private String description;

    private String attachment;

    @Builder.Default
    @Column(nullable = false)
    private Boolean deleted = false;
}

