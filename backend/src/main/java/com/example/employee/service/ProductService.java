package com.example.employee.service;

import com.example.employee.model.Product;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {

    Product createProduct(String name, String description, MultipartFile file);

    Product updateProduct(Long id, String name, String description, MultipartFile file);

    List<Product> getAllProducts();

    void deleteProduct(Long id);

    byte[] downloadAttachment(Long id);
}

