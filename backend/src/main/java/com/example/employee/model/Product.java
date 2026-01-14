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

    @Convert(converter = EncryptedStringConverter.class)
    @Column(nullable = false)
    private String name;

    @Convert(converter = EncryptedStringConverter.class)
    @Column(nullable = false, length = 2000)
    private String description;

    private String attachmentPath;

    @Builder.Default
    @Column(nullable = false)
    private Boolean deleted = false;
}

