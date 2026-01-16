package com.example.employee.service.impl;

import com.example.employee.dto.VisitorRequest;
import com.example.employee.model.*;
import com.example.employee.repository.*;
import com.example.employee.service.EmailService;
import com.example.employee.service.VisitorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VisitorServiceImpl implements VisitorService {

    private final VisitorRepository visitorRepository;
    private final ProductRepository productRepository;
    private final ExhibitionRepository exhibitionRepository;
    private final VisitorProductRepository visitorProductRepository;
    private final EmailService emailService;

    @Override
    @Transactional
    public Visitor createVisitor(VisitorRequest request) {

        Exhibition exhibition = exhibitionRepository.findById(
                request.getExhibitionId()
        ).orElseThrow(() -> new RuntimeException("Exhibition not found"));

        Visitor visitor = new Visitor();
        visitor.setName(request.getName());
        visitor.setEmail(request.getEmail());
        visitor.setPhone(request.getPhone());
        visitor.setCompanyName(request.getCompanyName());
        visitor.setExhibition(exhibition);

        Visitor savedVisitor = visitorRepository.save(visitor);

        List<Product> selectedProducts = new ArrayList<>();

        for (Long productId : request.getProductIds()) {

            // ✅ Prevent duplicate visitor-product mapping
            if (visitorProductRepository.existsByVisitorIdAndProductId(
                    savedVisitor.getId(), productId)) {
                continue;
            }

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            VisitorProduct vp = new VisitorProduct();
            vp.setVisitor(savedVisitor);
            vp.setProduct(product);

            visitorProductRepository.save(vp);
            selectedProducts.add(product);
        }

        // 📧 Send email with selected product attachments
        emailService.sendVisitorProductEmail(
                savedVisitor.getEmail(),
                savedVisitor.getName(),
                exhibition.getName(),
                selectedProducts
        );

        return savedVisitor;
    }

    @Override
    public List<Visitor> getVisitorsByExhibition(Long exhibitionId) {
        return visitorRepository.findByExhibitionId(exhibitionId);
    }

    @Override
    public List<Visitor> getAllVisitors() {
        return visitorRepository.findAll();
    }
}
