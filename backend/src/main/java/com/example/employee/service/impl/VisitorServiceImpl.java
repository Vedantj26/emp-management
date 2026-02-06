package com.example.employee.service.impl;

import com.example.employee.dto.VisitorCreateResponse;
import com.example.employee.dto.VisitorRequest;
import com.example.employee.dto.VisitorSummary;
import com.example.employee.model.*;
import com.example.employee.repository.*;
import com.example.employee.service.EmailService;
import com.example.employee.service.VisitorService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class VisitorServiceImpl implements VisitorService {

    private static final Logger logger = LoggerFactory.getLogger(VisitorServiceImpl.class);

    private final VisitorRepository visitorRepository;
    private final ProductRepository productRepository;
    private final ExhibitionRepository exhibitionRepository;
    private final VisitorProductRepository visitorProductRepository;
    private final EmailService emailService;

    @Transactional
    public Visitor createVisitorInternal(VisitorRequest request) {

        boolean exists = visitorRepository.existsByEmailAndExhibitionId(
                request.getEmail(),
                request.getExhibitionId()
        );

        if (exists) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This email is already registered for this exhibition"
            );
        }

        Exhibition exhibition = exhibitionRepository.findById(request.getExhibitionId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Exhibition not found"));

        Visitor visitor = new Visitor();

        visitor.setName(request.getName());
        visitor.setEmail(request.getEmail());
        visitor.setPhone(request.getPhone());
        visitor.setCompanyName(request.getCompanyName());
        visitor.setDesignation(request.getDesignation());
        visitor.setCityState(request.getCityState());

        visitor.setCompanyType(request.getCompanyType());
        visitor.setCompanyTypeOther(request.getCompanyTypeOther());

        visitor.setIndustry(request.getIndustry());
        visitor.setIndustryOther(request.getIndustryOther());

        visitor.setCompanySize(request.getCompanySize());
        visitor.setInterestAreas(request.getInterestAreas());

        visitor.setSolutions(request.getSolutions());
        visitor.setSolutionsOther(request.getSolutionsOther());

        visitor.setTimeline(request.getTimeline());
        visitor.setBudget(request.getBudget());

        visitor.setFollowUpMode(request.getFollowUpMode());
        visitor.setBestTimeToContact(request.getBestTimeToContact());

        visitor.setAdditionalNotes(request.getAdditionalNotes());
        visitor.setConsent(request.getConsent());

        visitor.setExhibition(exhibition);

        Visitor savedVisitor = visitorRepository.save(visitor);

        Set<Long> uniqueProductIds = new HashSet<>(request.getProductIds());
        List<Product> selectedProducts = new ArrayList<>();

        for (Long productId : uniqueProductIds) {

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

        return savedVisitor;
    }

    @Override
    public VisitorCreateResponse createVisitorPublic(VisitorRequest request) {

        Visitor visitor = createVisitorInternal(request);
        boolean emailSent = true;
        String emailError = null;

        try {
            emailService.sendVisitorProductEmail(
                    visitor.getEmail(),
                    visitor.getName(),
                    visitor.getExhibition().getName(),
                    visitorProductRepository.findProductsByVisitorId(visitor.getId())
            );
            logger.info("Visitor email sent to {}", visitor.getEmail());
        } catch (Exception e) {
            // Do not fail the flow, but record the failure for the client.
            emailSent = false;
            emailError = e.getMessage();
            logger.error("Email failed for visitor {}: {}", visitor.getEmail(), e.getMessage(), e);
        }

        VisitorSummary summary = new VisitorSummary(
                visitor.getId(),
                visitor.getName(),
                visitor.getEmail()
        );

        return new VisitorCreateResponse(summary, emailSent, emailError);
    }

    @Override
    public boolean visitorExists(String email, Long exhibitionId) {
        if (email == null || exhibitionId == null) return false;
        String normalizedEmail = email.trim().toLowerCase();
        return visitorRepository.existsByEmailAndExhibitionId(normalizedEmail, exhibitionId);
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
