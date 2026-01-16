package com.example.employee.service.impl;

import com.example.employee.model.Product;
import com.example.employee.repository.ProductRepository;
import com.example.employee.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    private final Path uploadDir = Paths.get("uploads/products");

    @Override
    public Product createProduct(Product product, MultipartFile file) {
        handleFileUpload(product, file);
        product.setDeleted(false);
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long id, Product updatedProduct, MultipartFile file) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        existing.setName(updatedProduct.getName());
        existing.setDescription(updatedProduct.getDescription());

        handleFileUpload(existing, file);

        return productRepository.save(existing);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findByDeletedFalse();
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setDeleted(true);
        productRepository.save(product);
    }

    private void handleFileUpload(Product product, MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) return;

            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), uploadDir.resolve(filename));

            product.setAttachment(filename);

        } catch (IOException e) {
            throw new RuntimeException("File upload failed", e);
        }
    }
}
