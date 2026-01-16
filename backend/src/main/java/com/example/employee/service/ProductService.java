package com.example.employee.service;

import com.example.employee.model.Product;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {

    Product createProduct(Product product, MultipartFile file);

    Product updateProduct(Long id, Product product, MultipartFile file);

    List<Product> getAllProducts();

    void deleteProduct(Long id);
}
