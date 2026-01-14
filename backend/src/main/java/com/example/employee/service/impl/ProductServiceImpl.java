package com.example.employee.service.impl;

import com.example.employee.model.Product;
import com.example.employee.repository.ProductRepository;
import com.example.employee.service.ProductService;
import com.example.employee.util.FileStorageUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final FileStorageUtil fileStorageUtil;

    @Override
    public Product createProduct(String name, String description, MultipartFile file) {

        String path = null;
        if (file != null && !file.isEmpty()) {
            path = fileStorageUtil.saveFile(file);
        }

        Product product = Product.builder()
                .name(name)
                .description(description)
                .attachmentPath(path)
                .build();

        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long id, String name, String description, MultipartFile file) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(name);
        product.setDescription(description);

        if (file != null && !file.isEmpty()) {
            product.setAttachmentPath(fileStorageUtil.saveFile(file));
        }

        return productRepository.save(product);
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

    @Override
    public byte[] downloadAttachment(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return fileStorageUtil.readFile(product.getAttachmentPath());
    }
}

